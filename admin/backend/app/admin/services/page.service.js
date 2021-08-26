import { matchedData } from 'express-validator/filter';
import utils from '../../utils';
import Page from '../../models/page.model';
import BaseService from '../../services/base.service';
import objectService from './object.service';

class PagesServie extends BaseService {
  constructor() {
    super(Page);
  }

  getByCondition = (query, options) => Page.paginate(query, options);

  create = data => Page.create(data);

  update = page => page.save();

  list = async req => {
    let keyword = req.body.keyword || '';
    keyword = utils.escape(keyword.trim());
    const page = parseInt(req.body.page, 10) || 1;
    const limit = parseInt(req.body.limit, 10) || 10;
    let sort = { created: 'desc' };
    const offset = parseInt(req.body.offset, 10) || 0;
    const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];
    if (sortKey.length && ['name', 'url', 'code', 'created'].indexOf(sortKey[0]) > -1) {
      sort = {};
      if (sortKey[0] === 'name') {
        sort.name = req.body.sort.name;
      } else {
        sort[sortKey] = req.body.sort[sortKey];
      }
    }

    const selectFields = {
      name: 1,
      code: 1,
      url: 1,
      description: 1,
      active: 1,
    };
    const AND = [{ deleted: false }];
    if (keyword) {
      AND.push({
        $or: [
          { name: new RegExp(`.*${keyword}.*`, 'gi') },
          { code: new RegExp(`.*${keyword}.*`, 'gi') },
        ],
      });
    }
    const results = await this.getByCondition(
      {
        $and: AND,
      },
      {
        select: selectFields,
        sort,
        page,
        offset,
        limit,
      },
    );
    if (results.docs.length) {
      const docs = [];
      results.docs.forEach(result => {
        const doc = objectService.getPageObject(result, true);
        docs.push(doc);
      });
      results.docs = docs;
    }

    return results;
  };

  getDropdown = res => {
    Page.find()
      .select('_id name')
      .then(role => {
        const roles = [{ value: '', label: 'All' }];
        role.forEach(element => {
          const obj = {};
          obj.value = element._id;
          obj.label = element.name;
          roles.push(obj);
        }, this);
        return roles;
      })
      .then(utils.respondResultWithPaging(res))
      .catch(err => utils.handleError(res, err));
  };

  changeStatus = async req => {
    const data = matchedData(req);
    if (data.status === 'Delete') {
      const cust = await this.updateStatus(data.ids, { deleted: true });
      return cust;
    }
    const status = data.status === 'Active';
    const cust = await this.updateStatus(data.ids, { active: status });
    return cust;
  };
}
export default new PagesServie();
