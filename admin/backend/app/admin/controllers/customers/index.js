import express from 'express';
import { body, param, checkSchema } from 'express-validator/check';
import CustomerController from './customers.controller';
import { controllerHandler } from '../../../utils/async.handler';
import Validator from './customers.validation';

const router = express.Router();
const controller = new CustomerController();

class CustomersRoute {
  static route() {
    router.post('/list', controllerHandler(controller.list, req => [req]));
   
    router.post(
      '/create',
      checkSchema(Validator.create()),
      controllerHandler(controller.create, req => [req]),
    );


     router.post(
      '/generate-pdf-file',
      controllerHandler(controller.generatePdfFile, req => [req]),
    );

    router.post(
      '/get-pdf-file',
      controllerHandler(controller.getPdfFile, req => [req]),
    );

    router.post(
      '/send-voucher',
      controllerHandler(controller.sendVoucher, req => [req]),
    );

    router.put(
      '/:id',
      checkSchema(Validator.update()),
      controllerHandler(controller.update, req => [req]),
    );

    router.get(
      '/get-booking-prices',
      controllerHandler(controller.getBookingPrices, req => []),
      );


    router.post(
      '/change-status',
      controllerHandler(controller.changeStatus, req => [req]),
    );

    
    router.post(
      '/update-booking-prices',
      controllerHandler(controller.updateBookingPrice, req => [req]),
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
    return router;
  }
}

export default CustomersRoute.route();
