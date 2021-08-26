import express from 'express';
import { body, param, checkSchema } from 'express-validator/check';
import BookingPriceController from './booking-prices.controller';
import { controllerHandler } from '../../../utils/async.handler';
import Validator from './booking-prices.validation';

const router = express.Router();
const controller = new BookingPriceController();

class CategoriesRoute {
  static route() {
    router.post('/list', controllerHandler(controller.list, req => [req]));

    router.post(
      '/create',
      checkSchema(Validator.create()),
      controllerHandler(controller.create, req => [req]),
    );

      router.post(
      '/update-availability',
      controllerHandler(controller.updateAvailability, req => [req]),
    );

    router.put(
      '/:id',
      checkSchema(Validator.update()),
      controllerHandler(controller.update, req => [req]),
    );

    router.get(
      '/parents/:id',
      [param('id').optional({ bodyFalsy: true })],
      controllerHandler(controller.parentLists, req => [req]),
    );

    router.post(
      '/change-status',
      [
        body('ids')
          .isLength({ min: 1 })
          .withMessage('please select booking-prices to update status.'),
        body('ids.*')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for booking-prices.'),
        body('status')
          .isLength({ min: 1 })
          .withMessage('status is required.')
          .isIn(['Active', 'In Active', 'Delete'])
          .withMessage(),
      ],
      controllerHandler(controller.changeStatus, req => [req]),
    );

    router.get(
      '/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for category.'),
      ],
      controllerHandler(controller.getById, req => [req]),
    );

    router.get(
      '/:id/childs',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for category.'),
      ],
      controllerHandler(controller.getSubCategory, req => [req]),
    );
    return router;
  }
}

export default CategoriesRoute.route();
