import httpStatus from 'http-status';
import roleService from '../../services/role.service';
import objectService from '../../services/object.service';
import BaseController from '../base.controller';

class RoleController extends BaseController {
  constructor() {
    super('Role');
  }

  list = async (req, res) => {
    const results = await roleService.model.find();
    const roles = [];
    if (results && results.length) {
      results.forEach(role => {
        const doc = objectService.getRoleObject(role);
        roles.push(doc);
      });
      return this.sendResponse(httpStatus.OK, true, this.messages.LIST_SUCCESS, roles);
    }
    return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
  };

  getById = async (req, res) => {
    const role = await roleService.model.findById(req.params.id).select('name capabilities active');
    if (!role) {
      return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
    }
    const doc = objectService.getRoleObject(role);
    doc.capabilities = role.capabilities;
    return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, doc);
  };

  update = async (req, res) => {
    const role = await roleService.model.findById(req.params.id);

    if (!role) {
      return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
    }
    const capabilities = req.body.capabilities && req.body.capabilities.length ? req.body.capabilities : [];

    role.capabilities = capabilities;
    await role.save();

    return this.sendResponse(httpStatus.OK, true, this.messages.CAP_UPDATE, {});
  };

  dropDown = () => roleService.getDropdown();
}

export default RoleController;
