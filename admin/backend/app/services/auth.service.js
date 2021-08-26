/* eslint consistent-return: ["off"], prefer-destructuring: ["off"] */

import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';

import Role from '../models/roles.model';
import User from '../models/user.model';
import utils, { status } from '../utils';
import config from '../config';
import BaseService from './base.service';

const jwtSecret = process.env.JWT_SECRET;

const validateJwt = expressJwt({
  secret: jwtSecret,
});

class AuthService extends BaseService {
  /**
   * Attach the user object to the request if user is valid and authorized
   * Otherwise returns error
   */
  checkAdminLogin = () => compose()
    .use(validateJwt)
    .use((err, req, res, next) => {
      if (err) {
        console.log(validateJwt);
        console.log(err);
        // @todo Uncomment below if next(err) is handled
        // if (err.name === 'UnauthorizedError') {
        //   const error = new Error('Missing or invalid token.');
        //   error.code = 401;
        //   next(error);
        // }

        // @todo Remove below code if above next(err) is handled
       /* return res.status(status.UNAUTHORIZED).json({
          success: false,
          message: 'You are not authorized to perform this operation.',
        });*/
      }
      next();
    })
    .use((req, res, next) => {
      const AdminRoles = [
        req.app.locals.ADMIN_ROLE_ID,
        req.app.locals.SUPER_ADMIN_ROLE_ID,
        req.app.locals.SERVICE_PROVIDER_ROLE_ID,
      ];

      if (req.user.roleId && AdminRoles.indexOf(req.user.roleId.toString()) === -1) {
        return utils.errorWithProperty(
          res,
          'You are not authorized to access the page.',
          {
            code: 401,
          },
          401,
        );
      }
      next();
    })
    .use((req, res, next) => User.findById(
      req.user.id,
      ['firstName', 'lastName', 'email', 'roleId', 'profile_pic', 'active', 'mobile'],
      { lean: true },
    )
      .exec()
      .then(user => {
        if (!user) {
          return utils.errorWithProperty(
            res,
            'You do not have permission to perform this action.',
          );
        }
        user.capabilities = [];
        req.user = user;

        if (!user.roleId) {
          next();
          return null;
        }

        return Role.findById(user.roleId).then(role => {
          if (!role) {
            next();
            return null;
          }
          req.user.capabilities = role.capabilities.toObject();
          next();
          return null;
        });
      }));

  isAuthorizedGetRole = function () {
    return compose()
      .use(validateJwt)
      .use((err, req, res, next) => {
        next();
      })
      .use((req, res, next) => {
        if (req.user !== undefined) {
          User.findById(req.user.id, 'name email roleId active')
            .populate('roleId', 'slug')
            .then(user => {
              if (!user) {
                return utils.errorWithProperty(res, 'User not found.');
              }
              req.user = user;
              next();
              return user;
            })
            .catch(utils.handleError(res, next));
        } else {
          next();
        }
      });
  };

  /**
   * Returns a jwt token, signed by the app secret
   */
  signToken = user => jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId._id,
      role: user.roleId.slug,
      capabilities:
        user.roleId.capabilities && user.roleId.capabilities.length
          ? user.roleId.capabilities
          : [],
      profileImg:
        user.profile_pic && user.profile_pic.length > 0
          ? config.awsWebUrl + config.uploadPath.user + user.profile_pic[0]
          : '',
    },
    jwtSecret,
    {
      expiresIn: 60 * 60 * 5,
    },
  );

  signTokenWeb = user => jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      receiveNotifications: user.receiveNotifications,
      profileImg:
        user.profile_pic && user.profile_pic.length > 0
          ? config.awsWebUrl + config.uploadPath.user + user.profile_pic[0]
          : '',
    },
    jwtSecret,
    {
      expiresIn: 60 * 60 * 5,
    },
  );

  checkLanguage = (req, res, next) => {
    const lang = req.get('accept-language');
    if (req.app.get('languages').indexOf(lang) !== -1) {
      req.lang = lang;
    } else {
      req.lang = 'en';
    }
    next();
  };
}

export default new AuthService();
