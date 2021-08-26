import { param, body } from 'express-validator/check';
import SystemEmailcontroller from './systemEmails.controller';
import { controllerHandler } from '../../../utils/async.handler';

const express = require('express');

const router = express.Router();
const controller = new SystemEmailcontroller();
class SystemEmailRoutes {
  static routes() {
    router.post(
      '/create',
      [
        body('title')
          .isLength({ min: 1 })
          .withMessage('Title is required')
          .trim()
          .escape(),
        body('code')
          .isLength({ min: 1 })
          .withMessage('Code is required')
          .trim()
          .escape(),
        body('subject')
          .isLength({ min: 1 })
          .withMessage('Subject is required')
          .trim()
          .escape(),
        body('fromName')
          .isLength({ min: 1 })
          .withMessage('From Name is required.')
          .trim()
          .escape(),
        body('fromEmail')
          .isLength({ min: 1 })
          .withMessage('From Email is required.')
          .isEmail()
          .withMessage('Please enter valid email address.')
          .trim()
          .escape(),
        body('message')
          .isLength({ min: 1 })
          .withMessage('Email Template is required.')
          .trim()
          .escape(),
      ],
      controllerHandler(controller.create, req => [req]),
    );

    router.post('/list', controllerHandler(controller.list, req => [req]));

    router.put(
      '/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for system email.'),
        body('title')
          .isLength({ min: 1 })
          .withMessage('Title is required.')
          .trim()
          .escape(),
        body('subject')
          .isLength({ min: 1 })
          .withMessage('Subject is required.')
          .trim()
          .escape(),
        body('fromName')
          .isLength({ min: 1 })
          .withMessage('From name is required.')
          .trim()
          .escape(),
        body('fromEmail')
          .isLength({ min: 1 })
          .withMessage('From email is required.')
          .trim()
          .escape(),
        body('bcc')
          .optional({ checkFalsy: true })
          .trim()
          .escape(),
        body('cc')
          .optional({ checkFalsy: true })
          .trim()
          .escape(),
        body('message')
          .isLength({ min: 1 })
          .withMessage('Email template is required.')
          .trim()
          .escape(),
      ],
      controllerHandler(controller.update, req => [req]),
    );

    router.get(
      '/:id',
      [
        param('id')
          .isMongoId()
          .withMessage('Please provide valid unique identifier for system email.'),
      ],
      controllerHandler(controller.getById, req => [req]),
    );
    return router;
  }
}

export default SystemEmailRoutes.routes();
