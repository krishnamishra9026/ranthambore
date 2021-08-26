import { body, param, checkSchema } from 'express-validator/check';
import { controllerHandler } from '../../../utils/async.handler';
import PagesController from './pages.controllers';
import Validator from './page.validation';

const express = require('express');

const router = express.Router();
const controller = new PagesController();

class PagesRouter {
  static route() {
    router.post('/list', controllerHandler(controller.list, req => [req]));
    router.get(
      '/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for role.'),
      ],
      controllerHandler(controller.getById, req => [req]),
    );

    router.post(
      '/change-status',
      [
        body('ids')
          .isLength({ min: 1 })
          .withMessage('please select pages to update status.'),
        body('ids.*')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for page.'),
        body('status')
          .isLength({ min: 1 })
          .withMessage('status is required.')
          .isIn(['Active', 'In Active', 'Delete'])
          .withMessage(),
      ],
      controllerHandler(controller.changeStatus, req => [req]),
    );
    router.put(
      '/:id',
      checkSchema(Validator.update()),
      controllerHandler(controller.update, req => [req]),
    );
    return router;
  }
}

export default PagesRouter.route();
