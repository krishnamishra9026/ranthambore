import express from 'express';
import { body, checkSchema } from 'express-validator/check';

import CapabilitiesController from './capabilities.controller';
import { controllerHandler } from '../../../utils/async.handler';
import Validator from './capability.validation';

const router = express.Router();
const controller = new CapabilitiesController();

class CapabilityRoutes {
  static routes() {
    router.post('/list', controllerHandler(controller.list, req => [req]));

    router.post(
      '/',
      checkSchema(Validator.create()),
      controllerHandler(controller.create, req => [req]),
    );

    router.post(
      '/remove',
      [
        body('ids')
          .isLength({ min: 1 })
          .withMessage('Please select capabilities to remove.'),
        body('ids.*')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for capability.'),
      ],
      controllerHandler(controller.removeById, req => [req]),
    );

    router.get('/all', controllerHandler(controller.getAll, req => [req]));
    router.get('/modules', controllerHandler(controller.getAllModules, req => [req]));
    return router;
  }
}

export default CapabilityRoutes.routes();
