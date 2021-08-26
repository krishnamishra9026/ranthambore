import express from 'express';
import { body, param, checkSchema } from 'express-validator/check';
import EventsController from './events.controller';
import { controllerHandler } from '../../../utils/async.handler';
import Validator from './events.validation';
import uploader from '../../../utils/image.uploader';

const router = express.Router();
const controller = new EventsController();

class EventsRoute {
  static route() {
    router.post('/list', controllerHandler(controller.list, req => [req]));

    router.post(
      '/create',
      checkSchema(Validator.create()),
      controllerHandler(controller.create, req => [req]),
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
          .withMessage('please select categories to update status.'),
        body('ids.*')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for categories.'),
        body('status')
          .isLength({ min: 1 })
          .withMessage('status is required.')
          .isIn(['Active', 'In Active', 'Delete'])
          .withMessage(),
      ],
      controllerHandler(controller.changeStatus, req => [req]),
    );

    router.post(
      '/update-availability',
      controllerHandler(controller.updateAvailability, req => [req]),
    );

    router.post(
      '/upload-csv',
       uploader.upload().single('upload_file'),
      controllerHandler(controller.uploadCsv, req => [req]),
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

export default EventsRoute.route();
