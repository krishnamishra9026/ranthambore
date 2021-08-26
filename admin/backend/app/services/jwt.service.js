import jwt from 'jsonwebtoken';

import Customer from '../models/customer.model';
import utils from '../utils';

const jwtSecret = process.env.JWT_SECRET;

class JwtService {
  checkJwtError = (err, req, res, next) => {
    if (err) {
      if (err.name === 'UnauthorizedError') {
        return utils.errorWithProperty(
          res,
          'You are not authorized to access the requested resource.',
          { code: 401 },
          401,
        );
      }
    }
    return next();
  };

  /**
   * Attach the user object to the request if authenticated
   * Otherwise returns 401
   */
  getAuthorizedCustomer = (req, res, next) => {
    Customer.findOne({
      where: { id: req.user.id, status: 'Active' },
      attributes: ['id', 'fullName', 'email'],
    })
      .then(user => {
        if (!user) {
          return utils.errorWithProperty(
            res,
            'You are not authorized to access the requested resource.',
            { code: 401 },
            401,
          );
        }

        req.user = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        };
        next();
        return user;
      })
      .catch(err => utils.handleError(res, err));
  };

  /**
   * Returns a jwt token, signed by the app secret
   *
   * @param {object|buffer|string} payload Payload to create token with
   * @param {object} opts options to create token with
   */
  createJwtToken = function(payload, opts) {
    return jwt.sign(payload, jwtSecret, opts);
  };
}
export default new JwtService();
