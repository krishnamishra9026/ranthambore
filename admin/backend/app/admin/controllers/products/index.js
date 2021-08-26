import express from 'express';
// import multiparty from 'connect-multiparty';
import { body, param, checkSchema } from 'express-validator/check';
import Products from './products.controller';
import Validator from './products.validation';
import { controllerHandler } from '../../../utils/async.handler';
import uploader from '../../../utils/image.uploader';

const router = express.Router();
const controller = new Products();
class ProductsRoutes {
  static routes() {
    router.post(
      '/create',
      uploader.upload().array('images'),
      checkSchema(Validator.create()),
      controllerHandler(controller.create, req => [req]),
    );

    router.put(
      '/:id',
      uploader.upload().array('images', 5),
      checkSchema(Validator.update()),

      controllerHandler(controller.update, req => [req]),
    );

    router.post(
      '/image-upload/:id',
      uploader.upload().array('images'),
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for product.'),
        body('title')
          .isLength({ min: 1 })
          .withMessage('Title is required')
          .trim()
          .escape(),
        body('sort_order')
          .optional({ bodyFalsy: true })
          .toInt(),
        body('isDefault')
          .isBoolean()
          .withMessage('Is main is required and It should be boolean value'),
      ],
      controllerHandler(controller.uploadImage, req => [req]),
    );

    router.post(
      '/image-delete/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for product image.'),
      ],
      controllerHandler(controller.deleteImage, req => [req]),
    );

    router.get(
      '/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for product.'),
      ],
      controllerHandler(controller.getById, req => [req]),
    );

    router.post('/list', controllerHandler(controller.list, req => [req]));

    router.get(
      '/:id/image-list',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for product.'),
      ],
      controllerHandler(controller.imageList, req => [req]),
    );

    router.post(
      '/change-status',
      [
        body('ids')
          .isLength({ min: 1 })
          .withMessage('please select products to update status.'),
        body('ids.*')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for products.'),
        body('status')
          .isLength({ min: 1 })
          .withMessage('status is required.')
          .isIn(['Active', 'In Active', 'Delete'])
          .withMessage(),
      ],
      controllerHandler(controller.changeStatus, req => [req]),
    );

    router.post(
      '/make-default/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for product image.'),
      ],
      controllerHandler(controller.makeDefaultImage, req => [req]),
    );
    return router;
  }
}
export default ProductsRoutes.routes();
