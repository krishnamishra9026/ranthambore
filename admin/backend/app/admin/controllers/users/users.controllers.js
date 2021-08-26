import { matchedData } from 'express-validator/filter';
import httpStatus from 'http-status';

import config from '../../../config';
import utils from '../../../utils';
import UserService from '../../services/user.service';
import objectService from '../../services/object.service';
import BaseController from '../base.controller';
import authService from '../../../services/auth.service';
import EmailService from '../../../utils/email.service';
import amazonService from '../../../utils/amazon.service';

class UserController extends BaseController {
  constructor() {
    super('User');
  }

	/**
	 * @api {get} users/create create new user
	 * @apiDescription Service to create new user
	 * @apiName create
	 * @apiGroup User
	 *
	 * @apiParam {String} firstName user.firstName User's first name.
	 * @apiParam {String} lastName user.lastName User's last name.
	 * @apiParam {String} email user.email User's email.
	 * @apiParam {String} password user.password User's password.
	 * @apiParam {String} roleId user.roleId User's roleId.
	 * @apiParam {String} gender user.gender User's gender.
	 * @apiUse UserObject
	 */
	create = async req => {
	  const user = matchedData(req);
	  const verificationCode = utils.GenerateCode();
	  const date = new Date();
	  if (user.status !== 'In Active') {
	    const tomorrowDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
	    user.resetTokenExpires = tomorrowDate;
	    user.resetVerificationCode = verificationCode;
	  }
	  user.roleId = req.app.locals.ADMIN_ROLE_ID;
	  user.createdBy = req.user._id;
	  const doc = await UserService.create(req, user);
	  return this.sendResponse(httpStatus.OK, true, this.messages.INSERT_SUCCESS, doc);
	};

	resetDefaultPwd = async req => {
	  const userId = req.params.id ? req.params.id : req.user._id;
	  const user = await UserService.getModel()
	    .findById(userId)
	    .select('+passwordHash');
	  if (user.status !== 'In Active') {
	    user.passwordHash = '';
	    user.status = 'Pending';
	    const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	    user.resetTokenExpires = tomorrowDate;
	    user.resetVerificationCode = utils.GenerateCode();
	    const verificationLink = `${utils.getSiteSetting(req, 'CONTROL_PANEL_URL')}${config.setPasswordPath}${
	      user.resetVerificationCode
	    }/${user._id}`;
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
	    await EmailService(user.email, 'FORGOT_PASSWORD_ADMIN', variables);
	    const doc = await user.save();
	    if (doc) {
	      return this.sendResponse(httpStatus.OK, true, 'Password Reset Successfully.');
	    }
	    return this.sendResponse(httpStatus.OK, false, 'Password not yet updated, Please try again.');
	  }
	  return this.sendResponse(httpStatus.OK, false, this.messages.NOT_ACTIVE);
	};

	update = async req => {
	  const userId = req.params.id ? req.params.id : req.user._id;
	  const data = matchedData(req);
	  const user = await UserService.getModel()
	    .findById(userId)
	    .select('+passwordHash');
	  if (user) {
	    user.firstName = data.firstName;
	    user.lastName = data.lastName;
	    user.email = data.email;
	    user.mobile = data.mobile;
	    if (
	      user.status === 'In Active'
				&& data.status === 'Active'
				&& user.roleId.toString() === req.app.locals.ADMIN_ROLE_ID
				&& !user.passwordHash
	    ) {
	      user.status = 'Pending';
	      const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	      user.resetTokenExpires = tomorrowDate;
	      user.resetVerificationCode = utils.GenerateCode();
	      const verificationLink = `${utils.getSiteSetting(req, 'CONTROL_PANEL_URL')}${config.setPasswordPath}${
	        user.resetVerificationCode
	      }/${user._id}`;
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
	      await EmailService(user.email, 'FORGOT_PASSWORD_ADMIN', variables);
	    } else if (user.status === 'Pending' && data.status === 'Active') {
	      user.status = 'Pending';
	    } else {
	      user.status = data.status;
	    }
	    if (data.gender) {
	      user.gender = data.gender;
	    }
	    user.phone = data.phone;
	    user.company = Object.assign({}, user.company, data.company);
	    await user.save();
	    if (!req.params.id) {
	      await UserService.getModel()
	        .findById(userId)
	        .populate({
	          path: 'roleId',
	          select: 'slug capabilities',
	        });
	    }
	    return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, user);
	  }
	  return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	};

	updateProfile = async req => {
	  const userId = req.user._id;
	  const data = matchedData(req);
	  const user = await UserService.getModel().findById(userId);
	  if (user) {
	    user.firstName = data.firstName;
	    user.lastName = data.lastName;
	    user.email = data.email;
	    user.mobile = data.mobile;
	    if (data.gender) {
	      user.gender = data.gender;
	    }

	    user.phone = data.phone;
	    user.updatedBy = req.user._id;

	    await user.save();

	    if (req.file !== undefined) {
	      utils.checkFileSizeInMB(req.file.size, 1);
	      const oldImage = user.profile_pic ? user.profile_pic : '';

	      let deletedPic = null;

	      if (oldImage) {
	        deletedPic = await amazonService.deleteObject(config.uploadPath.profile + oldImage);
	      } else {
	        deletedPic = true;
	      }

	      if (deletedPic) {
	        await amazonService.saveFile(req.file, config.uploadPath.profile + req.file.filename);
	        user.profile_pic = req.file.filename;
	      }
	      await user.save();
	    }

	    if (!req.params.id) {
	      await UserService.getModel()
	        .findById(userId)
	        .populate({
	          path: 'roleId',
	          select: 'slug capabilities',
	        });
	    }
	    user.profile_pic = `${config.s3.webUrl}/${config.uploadPath.profile + user.profile_pic}`;
	    return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, {
	      user,
	      token: authService.signToken(user),
	    });
	  }

	  return this.throwError(401, true, 'User not found!');
	};

	list = async req => {
	  const doc = await UserService.list(req);
	  return this.sendResponse(200, true, this.messages.LIST_SUCCESS, utils.getPagination(doc));
	};

	/**
	 * @api {get} users/:id Get User Detail
	 * @apiDescription Service to get user detail
	 * @apiName GetUserDetail
	 * @apiGroup User
	 *
	 * @apiParam {String} id User's unique identifier.
	 *
	 * @apiUse UserObject
	 */



	 updateBookingPrice = async req => {
	 	const { MongoClient } = require('mongodb');
	 	const client = await MongoClient.connect('mongodb://127.0.0.1:27017/ranthamborejs');
		const db = client.db('ranthamborejs');

	 	var myquery = {};
	 	var newvalues = {$set: {'indian_price': 100 , 'foreigner_price' : 200} };
	 	db.collection("booking_prices").updateOne(myquery, newvalues, function(err, res) {
	 	if (err) {
	 		return this.sendResponse(200, true,  'Price Not Updated Successfully!' ,{});
	 	}	 	else{

	 		 return this.sendResponse(200, true, 'Price Updated Successfully!', {});
	 	}	
	 	});
	 };


	getById = async req => {
	  const user = await UserService.getModel().findById(req.params.id);

	  if (user) {
	    const doc = await objectService.getUserDetailObject(user, false);
	    doc.firstName = user.firstName;
	    doc.lastName = user.lastName;
	    return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, doc);
	  }
	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	changeStatus = async req => {
	  const update = UserService.changeStatus(req);
	  if (!update) {
	    return this.throwError(httpStatus.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};

	approve = async (req, res) => {
	  const data = matchedData(req);
	  return UserService.approveUsers(req, data, res);
	};

	resendToken = async req => {
	  const data = matchedData(req);
	  await UserService.resendToken(req, data);
	  return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};
}

export default UserController;
