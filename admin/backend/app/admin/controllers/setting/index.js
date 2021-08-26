import { body, param } from 'express-validator/check';

import Setting from './setting.controller';
import { controllerHandler } from '../../../utils/async.handler';

const express = require('express');

const router = express.Router();
const controller = new Setting();

class SettingRouter {
  static router() {
    router.post('/list', controllerHandler(controller.list, req => [req]));

    router.get(
      '/:type',
      param('type')
        .isLength({ min: 1 })
        .withMessage('Type is required')
        .trim()
        .escape(),
      controllerHandler(controller.getByType, req => [req]),
    );

    router.put(
      '/update',
      [
        body('setting.*')
          .isLength({ min: 1 })
          .withMessage('Setting value is required')
          .trim()
          .escape(),
      ],
      controllerHandler(controller.update, req => [req]),
    );
    return router;
  }
}

export default SettingRouter.router();
