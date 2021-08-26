import express from 'express';
import { param } from 'express-validator/check';
import { controllerHandler } from '../../../utils/async.handler';
import RoleController from './roles.controller';

const controller = new RoleController();
const router = express.Router();
class RoleRoute {
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

    router.put(
      '/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for role.'),
      ],
      controllerHandler(controller.update, req => [req]),
    );

    router.get('/drop-down', controllerHandler(controller.dropDown, req => [req]));
    return router;
  }
}
export default RoleRoute.route();
