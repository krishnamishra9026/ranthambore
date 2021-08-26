import { matchedData } from 'express-validator/filter';
import httpStatus from 'http-status';
import utils from '../../../utils';
import pageService from '../../services/page.service';
import objectService from '../../services/object.service';
import BaseContrller from '../base.controller';

class PagesController extends BaseContrller {
  constructor() {
    super('Pages');
  }

  // need to finalize the error formatting
  prepareInputOption = (req, data) => {
    const obj = {
      name: data.name,
      description: data.description,
      code: data.code,
      url: data.url,
      deleted: data.deleted,
      active: data.active,
    };
    obj.metadata = data.metadata ? data.metadata : {};
    return obj;
  };

  update = async req => {
    const data = matchedData(req);
    const input = this.prepareInputOption(req, data);
    const page = await pageService.model.findById(req.params.id);
    if (page) {
      page.name = input.name;
      page.description = input.description;
      page.metadata = input.metadata;
      page.updatedBy = req.user._id;
      page.active = data.active;
      page.code = data.code;
      page.url = data.url;
      await pageService.update(page);
      return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, {});
    }
    return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
  };

  list = async req => {
    const result = await pageService.list(req);

    return this.sendResponse(
      httpStatus.OK,
      true,
      this.messages.LIST_SUCCESS,
      utils.getPagination(result),
    );
  };

  changeStatus = async req => {
    const update = await pageService.changeStatus(req);
    if (!update) {
      return this.throwError(httpStatus.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
    }
    return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
  };

  getById = async req => {
    const page = await pageService.model.findById(req.params.id);
    if (page) {
      const doc = objectService.getPageDetailObject(page);
      return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, doc);
    }
    return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
  };
}

export default PagesController;
