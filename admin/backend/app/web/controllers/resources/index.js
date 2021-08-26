import express from 'express';
import { checkSchema } from 'express-validator/check';

import { controllerHandler } from '../../../utils/async.handler';
import ResourcesController from './resources.controller';
import Validator from './resources.validation';

const router = express.Router();
const controller = new ResourcesController();

class ResourcesRoutes {
  static routes() {
    router.get(
      '/countries',
      checkSchema({
        keyword: {
          in: ['query'],
          optional: { checkFalsy: true },
          trim: true,
          escape: true,
        },
      }),
      controllerHandler(controller.countries, req => [req]),
    );

    router.get(
      '/banners/:category/',
      checkSchema(Validator.category()),
      controllerHandler(controller.banners, req => [req]),
    );

    router.get(
      '/states/:id',
      checkSchema(Validator.states()),
      controllerHandler(controller.getStates, req => [req]),
    );

    router.get(
      '/cities/:id/',
      checkSchema(Validator.cities()),
      controllerHandler(controller.getCities, req => [req]),
    );

    router.get(
      '/page/:slug',
      checkSchema(Validator.slug()),
      controllerHandler(controller.getPage, req => [req]),
    );

    router.post(
      '/contact-us',
      checkSchema(Validator.contactUs()),
      controllerHandler(controller.contactUs, req => [req]),
    );

    return router;
  }
}

export default ResourcesRoutes.routes();
