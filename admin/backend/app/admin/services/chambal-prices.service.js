import ChambalPrices from '../../models/chambalPrice.model';
import utils from '../../utils';
import BaseService from '../../services/base.service';
import objectService from './object.service';

class ChambalPricessService extends BaseService {
  constructor() {
    super(ChambalPrices);
  }

	getByCondition = (query, options) => ChambalPrices.paginate(query, options);

	changeStatus = async data => {
	  if (data.status === 'Delete') {
	    const chambalprices = await this.updateStatus(data.ids, { deleted: true });
	    return chambalprices;
	  }
	  const status = data.status === 'Active';
	  const chambalprices = await this.updateStatus(data.ids, { active: status });
	  return chambalprices;
	};

	list = async req => {
	  const filters = req.body.filters || [];
	  let keyword = req.body.keyword || '';
	  keyword = utils.escape(keyword.trim());
	  const offset = parseInt(req.body.offset, 10) || 0;
	  const limit = parseInt(req.body.limit, 10) || 10;
	  let sort = { name: 'desc' };
	  const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];

	  if (sortKey.length && ['name'].indexOf(sortKey[0]) > -1) {
	    sort = {};
	    if (sortKey[0] === 'name') {
	      sort.name = req.body.sort.name;
	    } else {
	      sort[sortKey] = req.body.sort[sortKey];
	    }
	  }

	  const selectFields = {
	    name: 1,
	    price: 1,
	  };

	  const AND = [{ deleted: false }];
	  // Changed $exists from true to false

	  if (filters.length > 0) {
	    filters.forEach(filter => {
	      if (Object.keys(filter)[0] === 'name' && filter.name) {
	        AND.push({
	          name: new RegExp(`.*${filter.name}.*`, 'gi'),
	        });
	      }
	    });
	  }

	  if (keyword) {
	    AND.push({
	      $or: [{ name: new RegExp(`.*${keyword}.*`, 'gi') }],
	    });
	  }
	  const result = await this.getByCondition(
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
	  const docs = [];
	  if (result.docs.length) {
	    result.docs.forEach(option => {
	      const doc = objectService.getChambalPricesObject(option, true);
	      docs.push(doc);
	    });
	    result.docs = docs;
	    return result;
	  }
	  return result;
	};

	create = async chambalprices => {
	  const chambalpricess = await this.model.create(chambalprices);
	  return chambalpricess;
	};

	update = async chambalprices => {
	  const doc = await chambalprices.save();

	  return doc;
	};
}

export default new ChambalPricessService();
