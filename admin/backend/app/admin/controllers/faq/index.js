import express from 'express';
import { body, param, checkSchema } from 'express-validator/check';
import { controllerHandler } from '../../../utils/async.handler';
import FAQController from './faq.controller';
import Validator from './faq.validation';

const router = express.Router();

const controller = new FAQController();
router.post('/list', controllerHandler(controller.list, req => [req]));
router.post('/create', checkSchema(Validator.create()), controllerHandler(controller.create, req => [req]));

router.put('/:id', checkSchema(Validator.update()), controllerHandler(controller.update, req => [req]));
router.post(
  '/remove',
  [
    body('ids')
      .isLength({ min: 1 })
      .withMessage('Please select FAQ to remove.'),
    body('ids.*')
      .isMongoId()
      .withMessage('Please provide valid unique identifier for faq.'),
  ],
  controllerHandler(controller.removeById, req => [req]),
);
router.get(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Please provide valid unique identifier for language label.'),
  ],
  controllerHandler(controller.getById, req => [req]),
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

module.exports = router;
