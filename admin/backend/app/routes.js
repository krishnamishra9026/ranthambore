import express from 'express';
import adminRoutes from './admin/routes';

const router = express.Router();

class AllRoutes {
  static routes() {
    router.use('/admin', adminRoutes);
    return router;
  }
}

export default AllRoutes.routes();
