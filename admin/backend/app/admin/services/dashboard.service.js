import Promise from 'bluebird';

import User from '../../models/user.model';

class DashboardService {
  getCounts = async req => {
    const results = await Promise.all([
      User.countDocuments({ roleId: req.app.locals.ADMIN_ROLE_ID, deleted: false }).exec(),
      User.countDocuments({
        roleId: req.app.locals.ADMIN_ROLE_ID,
        status: 'Active',
        deleted: false,
      }).exec(),
      User.countDocuments({
        roleId: req.app.locals.ADMIN_ROLE_ID,
        status: 'In Active',
        deleted: false,
      }).exec(),
    ]);
    let data = '';
    if (results.length) {
      data = {
        totalProducts: results[0] || 0,
        activeProducts: results[1] || 0,
        totalServiceProviders: results[2] || 0,
        activeServiceProviders: results[3] || 0,
        inActiveServiceProviders: results[4] || 0,
      };
    }
    return data;
  };
}

export default new DashboardService();
