import express from 'express';
import { body } from 'express-validator/check';

import AuthController from './auth.controller';
import auth from '../services/auth.service';
import { controllerHandler } from '../utils/async.handler';

import CapabilityRoutes from './controllers/capabilities';
import UserRoutes from './controllers/users';
import SystemEmailRoutes from './controllers/systemEmails';
import settingRouter from './controllers/setting';
import pagesRouter from './controllers/pages';
import roleRouter from './controllers/roles';
import DashboardRoute from './controllers/dashboard';
import CategoriesRoute from './controllers/categories';
import CustomersRoute from './controllers/customers';
import CambalBookingsRoute from './controllers/CambalBookings';
import EventsRoute from './controllers/events';
import BookingPricesRoute from './controllers/bookingPrices';
import ChambalPricesRoute from './controllers/chambalPrices';
import BrandRoute from './controllers/brand';
import ProductsRoutes from './controllers/products';
import FAQRoute from './controllers/faq';

const router = express.Router();
const authController = new AuthController();

class AdminRoutes {
  static routes() {
    router.post(
      '/login',
      [
        body('email')
          .isLength({ min: 1 })
          .withMessage('Email is required'),
        body('password')
          .isLength({ min: 1 })
          .withMessage('Password is required'),
      ],
      controllerHandler(authController.login, req => [req]),
    );

    router.post(
      '/forgot-password',
      [
        body('email')
          .isLength({ min: 1, max: 255 })
          .withMessage('email is required')
          .isEmail()
          .withMessage('Please enter valid email.')
          .trim()
          .escape(),
      ],
      controllerHandler(authController.forgotPassword, req => [req]),
    );

    router.post(
      '/verify-token',
      [
        body('id')
          .isMongoId()
          .withMessage('Id is required and it should mongoId.'),
        body('code').withMessage('code is required to match'),
      ],
      controllerHandler(authController.verifyToken, req => [req]),
    );

    router.post(
      '/verify-approve-token',
      [
        body('id')
          .isMongoId()
          .withMessage('Id is required and it should mongoId.'),
        body('code').withMessage('code is required to match'),
      ],
      controllerHandler(authController.verifyApproveToken, req => [req]),
    );

    router.post(
      '/set-password',
      [
        body('id')
          .isMongoId()
          .withMessage('Id is required and it should mongoId.'),
        body('password').withMessage('password is required.'),
      ],
      controllerHandler(authController.setPassword, req => [req]),
    );

    router.post(
      '/change-password',
      [
        body('oldPassword').withMessage('oldPassword is required.'),
        body('newPassword').withMessage('newPassword is required.'),
      ],
      controllerHandler(authController.changePassword, req => [req]),
    );
    router.use('/users', auth.checkAdminLogin(), UserRoutes);
    router.use('/system-emails', auth.checkAdminLogin(), SystemEmailRoutes);
    router.use('/settings', auth.checkAdminLogin(), settingRouter);
    router.use('/categories', auth.checkAdminLogin(), CategoriesRoute);
    router.use('/customers', auth.checkAdminLogin(), CustomersRoute);
    router.use('/cambal-bookings', auth.checkAdminLogin(), CambalBookingsRoute);
    router.use('/booking-prices', auth.checkAdminLogin(), BookingPricesRoute);
     router.use('/chambal-prices', auth.checkAdminLogin(), ChambalPricesRoute);
    router.use('/events', auth.checkAdminLogin(), EventsRoute);

    router.use('/pages', auth.checkAdminLogin(), pagesRouter);
    router.use('/roles', auth.checkAdminLogin(), roleRouter);
    router.use('/capabilities', auth.checkAdminLogin(), CapabilityRoutes);

    router.use('/dashboard', auth.checkAdminLogin(), DashboardRoute);
    router.use('/products', auth.checkAdminLogin(), ProductsRoutes);
    router.use('/faq', auth.checkAdminLogin(), FAQRoute);

    return router;
  }
}
export default AdminRoutes.routes();
