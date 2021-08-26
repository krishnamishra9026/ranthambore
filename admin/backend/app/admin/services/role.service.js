import Role from '../../models/roles.model';
import BaseService from '../../services/base.service';

class RoleService extends BaseService {
  constructor() {
    super(Role);
  }

  getByCondition = (query, options) => Role.paginate(query, options);

  getById = id => Role.findById(id);

  createRole = data => Role.create(data);

  getDropdown = () => {
    const roles = [];
    const results = Role.find()
      .select('_id name')
      .lean(true);
    results.forEach(element => {
      roles.push({
        value: element._id,
        label: element.name,
      });
    });
    return roles;
  };
}

export default new RoleService();
