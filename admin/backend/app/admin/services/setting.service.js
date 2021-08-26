import Promise from 'bluebird';
import { matchedData } from 'express-validator/filter';

import Setting from '../../models/setting.model';
import BaseService from '../../services/base.service';
import utils from '../../utils';

class SettingService extends BaseService {
  constructor() {
    super(Setting);
  }

  getByType = async type => {
    console.log({ type })
    const records = await this.model.find({ type });
    const docs = [];
    if (records.length) {
      records.forEach(record => {
        docs.push({
          id: record._id,
          name: record.name,
          description: record.description,
          value: utils.unescape(record.value),
          displayType: record.displayType,
          help: record.help,
          placeholder: record.placeholder,
          source: record.source,
          sourceValues: record.sourceValues || [],
          validateCode: record.validateCode,
          validateMessage: record.validateMessage,
        });
      });
      return docs;
    }
    return docs;
  };

  updateSetting = async req => {
    const postData = matchedData(req);

    const keys = Object.keys(postData.setting);
    const promises = keys.map(key => Setting.findOneAndUpdate(
      {
        name: key,
      },
      {
        $set: {
          value: postData.setting[key],
        },
      },
    ));
    await Promise.all(promises);

    const records = await Setting.find(
      {
        name: { $in: keys },
      },
      'name value',
    ).lean();
    records.forEach(record => {
      req.app.set(record.name, utils.unescape(record.value));
    });
    return records;
  };

  list = async req => {
    let keyword = req.body.keyword || '';
    keyword = utils.escape(keyword.trim());
    const offset = parseInt(req.body.offset, 10) || 0;
    const limit = parseInt(req.body.limit, 10) || 10;
    let sort = { name: 'asc' };
    const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];

    if (sortKey.length && ['name', 'value'].indexOf(sortKey[0]) > -1) {
      sort = {};
      sort[sortKey] = req.body.sort[sortKey];
    }

    const selectFields = {
      description: 1,
      value: 1,
    };

    const AND = [{ name: { $ne: '' } }];

    if (keyword) {
      AND.push({
        $or: [
          { description: new RegExp(`.*${keyword}.*`, 'gi') },
          { value: new RegExp(`.*${keyword}.*`, 'gi') },
        ],
      });
    }

    const result = await this.model.paginate(
      {
        $and: AND,
      },
      {
        select: selectFields,
        sort,
        offset,
        limit,
      },
    );

    if (result.docs.length) {
      const docs = [];
      result.docs.forEach(option => {
        docs.push({
          name: option.description,
          value: utils.unescape(option.value),
        });
      });
      result.docs = docs;
      return result;
    }
    return result;
  };
}

export default new SettingService();
