import httpStatus from 'http-status';
import dashboardService from '../../services/dashboard.service';
import BaseController from '../base.controller';

class DashboardControlle extends BaseController {
  constructor() {
    super('Dashboard');
  }

  counts = async (req, res) => {
    const count = await dashboardService.getCounts(req, res);
    return this.sendResponse(httpStatus.OK, true, '', count);
  };
}

export default DashboardControlle;
