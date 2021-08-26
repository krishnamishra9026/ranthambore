import express from 'express';

import resources from './controllers/resources';

const router = express.Router();

class WebRoutes {
  static routes() {
    router.use('/resources', resources);

    return router;
  }
}
export default WebRoutes.routes();
