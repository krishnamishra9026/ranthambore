import { matchedData } from 'express-validator/filter';

import utils, { status } from '../../../utils';
import capabilityService from '../../services/capability.service';
import objectService from '../../services/object.service';
import BaseController from '../base.controller';

import config from '../../../config';

class CapabilitiesController extends BaseController {
  constructor() {
    super('Capability');
  }

  /**
   * @api {post} /capabilities/create Create Capability
   * @apiName CreateCapability
   * @apiDescription Creates a new capability.
   * @apiGroup Capability
   * @apiUse authHeader
   *
   * @apiUse CapabilityObject
   */
  create = async req => {
    const capabilities = [];
    const postData = matchedData(req);
    let module = null;
    let moduleName = null;

    if (config.modules.length) {
      module = config.modules.filter(item => item.name === postData.module);
      if (module.length === 0) {
        return this.throwError(status.OK, true, `${postData.module} module not found.`);
      }
      moduleName = module[0].name;
    } else {
      return this.throwError(status.OK, true, 'Module not found.');
    }

    if (req.body.type === 'custom') {
      if (req.body.name.trim() !== '') {
        const name = `${req.body.name.charAt(0).toUpperCase()}${req.body.name.substr(
          1,
        )} ${moduleName}`;
        capabilities.push({
          module: moduleName,
          name,
          slug: utils.sanitizeUniqueName(name),
        });
      }
    }
    if (req.body.type === 'crud') {
      ['add', 'update', 'list', 'delete'].forEach(key => {
        if (req.body.types[key] === true) {
          const name = `${key.charAt(0).toUpperCase()}${key.substr(1)} ${moduleName}`;
          capabilities.push({
            module: moduleName,
            name,
            slug: utils.sanitizeUniqueName(name),
          });
        }
      });
    }
    if (capabilities.length === 0) {
      return this.throwError(status.OK, true, 'Capability not found to insert.');
    }

    const inserted = await capabilityService.model.insertMany(capabilities);
    if (inserted) {
      return this.sendResponse(status.OK, true, this.messages.INSERT_SUCCESS, {});
    }
    return this.throwError(status.OK, true, this.messages.INSERT_ERROR);
  };

  /**
   * @api {post} /capabilities/list List all Capability
   * @apiName ListCapability
   * @apiDescription Service capability list.
   * @apiGroup Capability
   * @apiUse authHeader
   * @apiUse pagingResponse
   *
   * @apiUse CapabilityList
   */
  list = async req => {
    const selectFields = ['name', 'module', 'slug'];

    let keyword = req.body.keyword || '';
    keyword = utils.escape(keyword.trim());
    const page = parseInt(req.body.page, 10) || 1;
    const offset = parseInt(req.body.offset, 10) || 0;
    let sort = { created: 'desc' };
    const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];
    if (sortKey.length && ['name', 'slug'].indexOf(sortKey[0]) > -1) {
      sort = {};
      sort[sortKey] = req.body.sort[sortKey];
    }

    const AND = [{ active: true }];

    if (keyword) {
      AND.push({
        $or: [
          { name: new RegExp(`.*${keyword}.*`, 'gi') },
          { slug: new RegExp(`.*${keyword}.*`, 'gi') },
        ],
      });
    }

    const result = await capabilityService.getByCondition(
      {
        $and: AND,
      },
      {
        select: selectFields,
        sort,
        page,
        offset,
      },
    );

    const docs = [];
    if (result.docs.length) {
      result.docs.forEach(capability => {
        const doc = objectService.getCapabilityObject(capability, true);
        docs.push(doc);
      });
      result.docs = docs;
    }

    return this.sendResponse(
      status.OK,
      true,
      this.messages.LIST_SUCCESS,
      utils.getPagination(result),
    );
  };

  removeById = async req => {
    if (!req.body.ids.length) {
      return this.sendResponse(
        status.OK,
        false,
        'Please provide valid unique identifier for capability!',
        [],
      );
    }
    const result = await capabilityService.model.deleteMany({
      _id: { $in: req.body.ids },
    });
    if (result.n && result.n > 0) {
      return this.sendResponse(status.OK, true, this.messages.DELETE_SUCCESS, []);
    }
    return this.sendResponse(status.OK, false, this.messages.NOT_FOUND, []);
  };

  getAll = async req => {
    const results = await capabilityService.getAll(req);
    results.forEach(key => {
      key.module = key._id;
      key._id = undefined;
    });
    return this.sendResponse(status.OK, true, this.messages.LIST_SUCCESS, results);
  };

  getAllModules = async () => {
    let results = [];
    if (config.modules.length) {
      results = config.modules;
    }

    return this.sendResponse(status.OK, true, this.messages.LIST_SUCCESS, results);
  };
}

export default CapabilitiesController;
