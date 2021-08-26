import boom from 'boom';
import { validationResult } from 'express-validator/check';

import utils, { log, status } from './index';

const errorFormatter = error => ({
  param: error.param,
  message: error.msg,
});

// wrapper for our async route handlers
export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (!err.isBoom) {
      return next(boom.badImplementation(err));
    }
    next(err);
  });
};

// export const controllerHandler = (promise, params) => async (req, res, next) => {
//   const boundParams = params ? params(req, res, next) : [];
//   const errors = validationResult(req).formatWith(errorFormatter);
//   if (!errors.isEmpty()) {
//     const error = errors.mapped({ onlyFirstError: true });
//     return utils.errorWithProperty(res, error[Object.keys(error)[0]].message, {
//       errors: error,
//     });
//   }
//   try {
//     const result = await promise(...boundParams);
//     return res.json(result);
//   } catch (err) {
//     if (!err.code) {
//       err.code = status.BAD_REQUEST;
//     }
//     log(err);
//     return next(err);
//   }
// };

export const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    const error = errors.mapped({
      onlyFirstError: true,
    });
    return utils.errorWithProperty(res, error[Object.keys(error)[0]].message, {
      errors: error,
    });
  }
  try {
    const result = await promise(...boundParams);
    return res.json(result);
  } catch (err) {
    if (!err.code) {
      err.code = status.BAD_REQUEST;
    }
    // log(err);
    return next(err);
  }
};

// export const controllerHandler = (promise, params) => async (
//   req,
//   res,
//   next,
// ) => {
//   const boundParams = params ? params(req, res, next) : [];

//   const errors = validationResult(req).formatWith(errorFormatter);
//   if (!errors.isEmpty()) {
//     const error = errors.mapped({ onlyFirstError: true });
//     return utils.errorWithProperty(res, error[Object.keys(error)[0]].message, {
//       errors: error,
//     });
//   }
//   try {
//     const result = await promise(...boundParams);
//     return res.json(result);
//   } catch (err) {
//     if (!err.code) {
//       err.code = status.BAD_REQUEST;
//     }
//     log(err);
//     return next(err);
//   }
// };

export const wrap = fn => (...args) => fn(...args).catch(args[2]);
