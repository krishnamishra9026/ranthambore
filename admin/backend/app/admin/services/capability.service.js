import Capability from '../../models/capabilities.model';
import BaseService from '../../services/base.service';

class CapabilityService extends BaseService {
  constructor() {
    super(Capability);
  }

  getAll = () => Capability.aggregate([
    {
      $match: {
        active: true,
      },
    },
    {
      $group: {
        _id: '$module',
        capabilities: {
          $push: {
            name: '$name',
            active: '$active',
            slug: '$slug',
            _id: '$_id',
          },
        },
      },
    },
  ]);

  getByCondition = (query, options) => Capability.paginate(query, options);
}

export default new CapabilityService();
