import express from 'express';
import DashboardControle from './dashboard.controller';
import { controllerHandler } from '../../../utils/async.handler';

const controller = new DashboardControle();

const router = express.Router();

class DashboardRoute {
  static route() {
    router.get('/counts', controllerHandler(controller.counts, req => [req]));
    return router;
  }
}
export default DashboardRoute.route();
