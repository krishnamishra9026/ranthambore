import async from 'async';
import config from '../../config';
import utils, { status } from '../../utils';
import Enum from '../../utils/enums';
import User from '../../models/user.model';
import EmailService from '../../utils/email.service';
import BaseService from '../../services/base.service';
import objectService from './object.service';

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  getModel = () => User;
  login = async (req, data) => {
    const user = await User.findOne(
      {
        email: data.email,
      },
      [
        'firstName',
        'lastName',
        'name',
        'email',
        'mobile',
        'status',
        'roleId',
        'profile_pic',
        '+passwordHash',
        'resetVerificationCode',
      ],
    ).populate({
      path: 'roleId',
      select: 'slug capabilities',
    });
    return user;
  };

  create = async (req, user) => {
    let isMailSetPass = false;
    let password;
    const pwdToSave = user.passwordHash;
    // if user is active check for set pass or email
    if (user.status === 'Active') {
      user.status = 'Pending';
      if (req.body.isPasswordSet && user.passwordHash !== '') {
        password = utils.getPasswordHash(user.passwordHash);
        user.passwordHash = password;
      } else {
        // password = utils.getPasswordHash('Abc@123');
        isMailSetPass = true;
      }
      // user.passwordHash = password;
    } else {
      delete user.passwordHash;
    }
    // else in active status do nothing
    const users = await this.getModel().create(user);
    if (users && users.status === 'Pending') {
      if (isMailSetPass) {
        const verificationLink = `${utils.getSiteSetting(
          req,
          'CONTROL_PANEL_URL',
        ) +
          config.setPasswordPath +
          user.resetVerificationCode}/${users._id}`;
        const variables = utils.replaceCompanyVariables(req);
        variables.push(
          {
            item: 'firstName',
            value: users.firstName,
          },
          {
            item: 'lastName',
            value: users.lastName,
          },
          {
            item: 'verificationLink',
            value: verificationLink,
          },
        );
        await EmailService(users.email, 'FORGOT_PASSWORD_ADMIN', variables);
      } else {
        const variables = utils.replaceCompanyVariables(req);
        variables.push(
          {
            item: 'firstName',
            value: users.firstName,
          },
          {
            item: 'lastName',
            value: users.lastName,
          },
          {
            item: 'email',
            value: users.email,
          },
          {
            item: 'tmpPwd',
            value: pwdToSave,
          },
        );
        await EmailService(users.email, 'USER_REGISTRATION', variables);
      }
      return user;
    }
    return users;
  };

  getByCondition = async (query, options) => User.paginate(query, options);

  approveUsers = (req, data, res) => {
    User.find({
      _id: {
        $in: data.ids,
      },
    })
      .then(users => {
        let count = 0;
        const date = new Date();
        const tomorrowDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        async.whilst(
          () => count < users.length,
          callback => {
            const user = users[count];
            const verificationCode = utils.GenerateCode();
            User.updateOne(
              {
                _id: user._id,
              },
              {
                status: 'Active',
                resetTokenExpires: tomorrowDate,
                resetVerificationCode: verificationCode,
              },
            ).then(() => {
              if (user.status === Enum.STATUS.Pending) {
                count += 1;
                callback(null, count);
                let verificationLink = '';
                let code = '';
                if (user.roleId.toString() === req.app.locals.ADMIN_ROLE_ID) {
                  code = 'User_Approve';
                  verificationLink = `${utils.getSiteSetting(
                    req,
                    'CONTROL_PANEL_URL',
                  )}${config.setPasswordPath}${verificationCode}/${user._id}`;
                } else {
                  return utils.errorWithProperty(res, 'Invalid User role!');
                }
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
                EmailService(user.email, code, variables);
              }
              return utils.errorWithProperty(res, 'Invalid User!');
            });
          },
          (err, n) => {
            if (err) {
              return utils.errorWithProperty(res, 'Updation error!');
            }
            return utils.successWithProperty(
              res,
              `${n} Users successfully updated!`,
            );
          },
        );
      })
      .catch(err => utils.handleError(res, err));
  };

  changeStatus = async req => {
    const data = req.body;

    if (data.status === 'Delete') {
      const user = await this.updateStatus(data.ids, {
        deleted: true,
      });
      return user;
    }
    const Userstatus = data.status;
    if (data.status === 'Active' || data.status === 'In Active') {
      const users = await User.find({
        _id: {
          $in: data.ids,
        },
      }).select('+passwordHash');
      await Promise.all(
        users.map(async userDetails => {
          if (data.status === 'Active' && userDetails.status === 'Pending') {
            data.ids.splice(userDetails._id, 1);
          } else if (data.status === 'Active' && !userDetails.passwordHash) {
            data.ids.splice(userDetails._id, 1);
            const tomorrowDate = new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000,
            );
            userDetails.resetTokenExpires = tomorrowDate;
            userDetails.resetVerificationCode = utils.GenerateCode();
            const verificationLink = `${utils.getSiteSetting(
              req,
              'CONTROL_PANEL_URL',
            )}${config.setPasswordPath}${userDetails.resetVerificationCode}/${
              userDetails._id
            }`;
            const variables = utils.replaceCompanyVariables(req);
            variables.push(
              {
                item: 'firstName',
                value: userDetails.firstName,
              },
              {
                item: 'lastName',
                value: userDetails.lastName,
              },
              {
                item: 'verificationLink',
                value: verificationLink,
              },
            );
            userDetails.status = 'Pending';
            await userDetails.save();
            await EmailService(
              userDetails.email,
              'FORGOT_PASSWORD_ADMIN',
              variables,
            );
          }
        }),
      );
    }

    const user = await this.updateStatus(data.ids, {
      status: Userstatus,
    });
    return user;
  };

  // eslint-disable-next-line consistent-return
  verifyApproveToken = async data => {
    const where = {
      _id: data.id,
      resetVerificationCode: data.code,
    };
    const user = await User.findOne(where);

    if (!user) {
      this.throwError(401, true, 'User data not found!');
    }
    const myDate = new Date(user.resetTokenExpires);
    if (myDate > new Date()) {
      return this.sendResponse(200, true, 'User successfully verified.', []);
    }
    this.throwError(
      500,
      true,
      'Your link is expired please contact administrator.',
    );
  };

  setPassword = async data => {
    const password = utils.getPasswordHash(data.password);
    const doc = await this.model.findOne({
      _id: data.id,
    });
    if (doc) {
      if (doc.status === 'Pending') {
        doc.status = 'Active';
      }

      doc.passwordHash = password;
      doc.resetVerificationCode = '';
      doc.resetTokenExpires = '';
      const data = await doc.save();
      if (data) {
        return this.sendResponse(200, true, 'Password set successfully.', {});
      }
      return this.throwError(401, true, 'Password not update');
    }

    return this.throwError(401, true, 'Password not update');
  };

  resendToken = async (req, data) => {
    const users = await User.find({
      _id: {
        $in: data.ids,
      },
    });
    if (users) {
      let count = 0;
      const date = new Date();
      const tomorrowDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      async.whilst(
        () => count < users.length,
        callback => {
          const user = users[count];
          const verificationCode = utils.GenerateCode();
          User.updateOne(
            {
              _id: user._id,
            },
            {
              status: 'Active',
              resetTokenExpires: tomorrowDate,
              resetVerificationCode: verificationCode,
            },
            // eslint-disable-next-line consistent-return
          ).then(() => {
            count += 1;
            callback(null, count);
            let verificationLink = '';
            let code = '';
            if (user.roleId.toString() === req.app.locals.ADMIN_ROLE_ID) {
              code = 'Resend_User_Approval';
              verificationLink = `${utils.getSiteSetting(
                req,
                'CONTROL_PANEL_URL',
              )}${config.setPasswordPath}${verificationCode}/${user._id}`;
            } else {
              return this.sendResponse(status.OK, false, 'Invalid use role');
            }
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
            EmailService(user.email, code, variables);
          });
        },
        (err, n) => {
          if (err) {
            return err;
          }
          return this.sendResponse(
            200,
            true,
            `Successfully Approved ${n} Users.`,
            '',
          );
        },
      );
    }
  };

  list = async req => {
    const selectFields = [
      'firstName',
      'lastName',
      'fullName',
      'mobile',
      'email',
      'gender',
      'status',
      'active',
      'profile_pic',
      'created',
    ];

    const filters = req.body.filters || [];
    let keyword = req.body.keyword || '';
    const startDate = req.body.startDate || '';
    const endDate = req.body.endDate || '';
    keyword = utils.escape(keyword.trim());
    const offset = parseInt(req.body.offset, 10) || 0;
    const limit = parseInt(req.body.limit, 10) || 10;
    let sort = {
      created: 'desc',
    };
    const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];
    if (
      sortKey.length &&
      ['name', 'email', 'mobile', 'created', 'status'].indexOf(sortKey[0]) > -1
    ) {
      sort = {};
      if (sortKey[0] === 'name') {
        sort.firstName = req.body.sort.name;
      } else {
        sort[sortKey] = req.body.sort[sortKey];
      }
    }

    const AND = [
      {
        deleted: false,
      },
      {
        roleId: req.app.locals.ADMIN_ROLE_ID,
      },
    ];

    if (filters.length > 0) {
      filters.forEach(filter => {
        let Obj = {};
        if (filter.key === 'name' && filter.value) {
          AND.push({
            $or: [
              {
                firstName: new RegExp(`.*${filter.value}.*`, 'gi'),
              },
              {
                lastName: new RegExp(`.*${filter.value}.*`, 'gi'),
              },
            ],
          });
        }

        if (filter.key === 'active' && filter.value !== '') {
          Obj[filter.key] = filter.value;
          AND.push(Obj);
        }

        if (filter.key === 'created') {
          if (
            filter.value &&
            filter.value.startDate &&
            filter.value.endDate &&
            filter.value.startDate !== '' &&
            filter.value.endDate !== ''
          ) {
            Obj = {};
            Obj[filter.key] = {
              $gte: filter.value.startDate,
              $lte: filter.value.endDate,
            };
            AND.push(Obj);
          }
        }
      });
    }

    if (keyword) {
      AND.push({
        $or: [
          {
            firstName: new RegExp(`.*${keyword}.*`, 'gi'),
          },
          {
            lastName: new RegExp(`.*${keyword}.*`, 'gi'),
          },
          {
            email: new RegExp(`.*${keyword}.*`, 'gi'),
          },
          {
            mobile: new RegExp(`.*${keyword}.*`, 'gi'),
          },
        ],
      });
    }

    if (startDate && endDate) {
      AND.push({
        $or: [
          {
            created: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        ],
      });
    }

    const result = await this.getByCondition(
      {
        $and: AND,
      },
      {
        select: selectFields,
        sort,
        offset,
        limit,
      },
    );

    if (result.docs.length) {
      const docs = [];
      result.docs.forEach(user => {
        const doc = objectService.getUserListObject(user, true);
        docs.push(doc);
      });
      result.docs = docs;

      return result;
    }
    return result;
  };
}
export default new UserService();
