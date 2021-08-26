import express from 'express';
import { body, param, checkSchema } from 'express-validator/check';

import UserController from './users.controllers';
import { controllerHandler } from '../../../utils/async.handler';
import uploader from '../../../utils/image.uploader';
import Validator from './user.validation';

const router = express.Router();
const controller = new UserController();

class UserRoutes {
  static routes() {
    router.post('/list', controllerHandler(controller.list, req => [req]));
    router.get(
      '/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for user.'),
      ],
      controllerHandler(controller.getById, req => [req]),
    );


    router.post(
      '/create',
      checkSchema(Validator.create()),
      controllerHandler(controller.create, req => [req]),
    );

    router.put(
      '/update-profile',
      uploader.upload().single('profile_pic'),
      checkSchema(Validator.update()),
      controllerHandler(controller.updateProfile, req => [req]),
    );

     router.put(
      '/update-booking-price',
      controllerHandler(controller.updateBookingPrice, req => [req]),
    );  

    router.put(
      '/:id',
      checkSchema(Validator.update()),
      controllerHandler(controller.update, req => [req]),
    );

    router.post(
      '/change-status',
      [
        body('ids')
          .isLength({
            min: 1,
          })
          .withMessage('please select users to update status.'),
        body('ids.*')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for users.'),
        body('status')
          .isLength({
            min: 1,
          })
          .withMessage('status is required.')
          .isIn(['Active', 'In Active', 'Delete', 'Pending'])
          .withMessage(),
      ],
      controllerHandler(controller.changeStatus, req => [req]),
    );

    router.post(
      '/approve',
      [
        body('ids')
          .isLength({
            min: 1,
          })
          .withMessage('please select users to update status.'),
      ],
      controllerHandler(controller.approve, req => [req]),
    );

    router.post(
      '/resend-token',
      [
        body('ids')
          .isLength({
            min: 1,
          })
          .withMessage('please select users to send new token.'),
      ],
      controllerHandler(controller.resendToken, req => [req]),
    );

    router.put(
      '/reset-default/:id',
      controllerHandler(controller.resetDefaultPwd, req => [req]),
    );
    return router;
  }
}
export default UserRoutes.routes();
