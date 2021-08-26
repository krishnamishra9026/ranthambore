import httpStatus from 'http-status';
import settingService from '../../services/setting.service';
import utils from '../../../utils';
import BaseController from '../base.controller';

class Setting extends BaseController {
  constructor() {
    super('Setting');
  }

  list = async req => {
    const docs = await settingService.list(req);

    if (!docs) {
      return this.throwError(httpStatus.OK, false, this.messages);
    }

    return this.sendResponse(
      httpStatus.OK,
      true,
      this.messages.LIST_SUCCESS,
      utils.getPagination(docs),
    );
  };

  getByType = async req => {
    const { type } = req.params;
    const settings = await settingService.getByType(type.charAt(0).toUpperCase() + type.substr(1));
    if (settings) {
      return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, settings);
    }
    return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
  };

  update = async req => {
    await settingService.updateSetting(req);
    return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, {});
  };
}
export default Setting;
