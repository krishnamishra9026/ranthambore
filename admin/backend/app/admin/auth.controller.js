import { matchedData } from 'express-validator/filter';
import config from '../config';

import utils, { status } from '../utils';
import User from '../models/user.model';

import authService from '../services/auth.service';
import userService from './services/user.service';
import EmailService from '../utils/email.service';
import BaseController from './controllers/base.controller';

class AuthController extends BaseController {
  constructor() {
    super('User');
  }

	/**
	 * @api {post} users/login Log In
	 * @apiDescription Service to login user
	 * @apiName UserLogin
	 * @apiGroup User
	 *
	 *
	 * @apiParam {String} username User's email address.
	 * @apiParam {String} password User's password.
	 *
	 * @apiUse UserObject
	 */
	login = async req => {
	  const data = matchedData(req);
	  const user = await userService.login(req, data);
	  if (user) {
	    if (user.status === 'Pending' && user.roleId._id.toString() === req.app.locals.ADMIN_ROLE_ID) {
	      if (data.password && user.passwordHash) {
	        if (user.authenticate(data.password, user.passwordHash)) {
	          return this.sendResponse(
	            status.OK,
	            true,
	            'Temporary password verified successfully. Please set your password.',
	            {
	              user,
	            },
	          );
	        }
	      }
	    } else if (user.status !== 'Active') {
	      return this.throwError(status.NOT_FOUND, true, this.messages.NOT_ACTIVE);
	    } else if (data.password && user.passwordHash) {
	      if (user.authenticate(data.password, user.passwordHash)) {
	        user.profile_pic =						user.profile_pic.length > 0
						  ? `${config.s3.webUrl}/${config.uploadPath.profile + user.profile_pic}`
						  : null;
	        return this.sendResponse(status.OK, true, this.messages.LOGGED_IN_SUCCESS, {
	          user,
	          token: authService.signToken(user),
	        });
	      }
	    }
	  }
	  this.throwError(status.NOT_FOUND, true, this.messages.INVALID_LOGIN);
	};

	forgotPassword = async req => {
	  const data = matchedData(req);
	  const verificationCode = utils.GenerateCode();
	  const date = new Date();
	  const tomorrowDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
	  const result = await User.findOneAndUpdate(
	    {
	      email: data.email,
	    },
	    {
	      resetVerificationCode: verificationCode,
	      resetTokenExpires: tomorrowDate,
	    },
	    {
	      New: true,
	    },
	  );

	  if (result) {
	    const verificationLink = `${utils.getSiteSetting(req, 'CONTROL_PANEL_URL')
				+ config.setPasswordPath
				+ verificationCode}/${result._id}`;
	    const variables = utils.replaceCompanyVariables(req);
	    variables.push(
	      {
	        item: 'firstName',
	        value: result.firstName,
	      },
	      {
	        item: 'lastName',
	        value: result.lastName,
	      },
	      {
	        item: 'verificationLink',
	        value: verificationLink,
	      },
	    );
	    await EmailService(result.email, 'FORGOT_PASSWORD_ADMIN', variables);
	    return this.sendResponse(
	      200,
	      true,
	      'Email has been sent to your registered email address to set password.',
	      verificationCode,
	    );
	  }
	  this.throwError(401, true, 'Email not found!');
	};

	verifyToken = async req => {
	  const data = matchedData(req);
	  const where = {
	    _id: data.id,
	    resetVerificationCode: data.code,
	    status: {
	      $in: ['Active', 'Pending'],
	    },
	  };
	  const user = await User.findOne(where);

	  if (user) {
	    const myDate = new Date(user.resetTokenExpires);
	    if (myDate > new Date()) {
	      if (data.changePass) {
	        return this.sendResponse(200, true, '', []);
	      }
	      const users = await user.save();
	      return this.sendResponse(200, true, '', users.toJSON());
	    }
	    const verificationCode = utils.GenerateCode();
	    user.resetVerificationCode = verificationCode;
	    await user.save();
	    const verificationLink = `${utils.getSiteSetting(req, 'CONTROL_PANEL_URL')
				+ config.setPasswordPath
				+ verificationCode}/${user._id}`;
	    const variables = utils.replaceCompanyVariables(req);
	    variables.push(
	      {
	        item: 'firstName',
	        value: user.firstName,
	      },
	      {
	        item: 'lastName',
	        value: user.lastName,
	      },
	      {
	        item: 'verificationLink',
	        value: verificationLink,
	      },
	    );
	    EmailService(user.email, 'Forgot_Password_Email', variables);
	    return this.sendResponse(
	      200,
	      true,
	      'Verification token is expired, the refresh token is sent to your registered email. Please check mail and try again.',
	      user.toJSON(),
	    );
	  }
	  return this.sendResponse(200, false, 'Verification token is not valid, please retry forgot password!', []);
	};

	changePassword = async req => {
	  const data = req.body;

	  const user = await User.findOne(
	    {
	      _id: data.id,
	    },
	    ['passwordHash'],
	  );

	  if (!user) {
	    return this.throwError(200, false, 'User not found');
	  }
	  if (!user.authenticate(req.body.oldPassword, user.passwordHash)) {
	    return this.throwError(200, false, 'Your old password does not match');
	  }

	  const newPassword = utils.getPasswordHash(data.newPassword);
	  user.passwordHash = newPassword;
	  await user.save();
	  return this.sendResponse(200, true, 'Password reset successfully', {});
	};

	verifyApproveToken = async (req, res) => {
	  const data = matchedData(req);
	  const user = await userService.verifyApproveToken(data, res);
	  return user;
	};

	setPassword = (req, res) => {
	  const data = matchedData(req);
	  return userService.setPassword(data, res);
	};
}
export default AuthController;
