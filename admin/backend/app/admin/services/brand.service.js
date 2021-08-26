import Brand from '../../models/brand.model';
import utils from '../../utils';
import BaseService from '../../services/base.service';
import objectService from './object.service';

class BrandService extends BaseService {
  constructor() {
    super(Brand);
  }

	getByCondition = (query, options) => Brand.paginate(query, options);

	changeStatus = async data => {
	  if (data.status === 'Delete') {
	    const brand = await this.updateStatus(data.ids, { deleted: true });
	    return brand;
	  }
	  const status = data.status === 'Active';
	  const brand = await this.updateStatus(data.ids, { active: status });
	  return brand;
	};

	list = async req => {
	  const filters = req.body.filters || [];
	  let keyword = req.body.keyword || '';
	  keyword = utils.escape(keyword.trim());
	  const offset = parseInt(req.body.offset, 10) || 0;
	  const limit = parseInt(req.body.limit, 10) || 10;
	  let sort = { name: 'desc' };
	  const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];

	  if (sortKey.length && ['name', 'active'].indexOf(sortKey[0]) > -1) {
	    sort = {};
	    if (sortKey[0] === 'name') {
	      sort.name = req.body.sort.name;
	    } else {
	      sort[sortKey] = req.body.sort[sortKey];
	    }
	  }

	  const selectFields = {
	    name: 1,
	    active: 1,
	    created: 1,
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
	      const doc = objectService.getBrandObject(option, true);
	      docs.push(doc);
	    });
	    result.docs = docs;
	    return result;
	  }
	  return result;
	};

	create = async brand => {
	  const doc = await this.model.create(brand);
	  return doc;
	};

	update = async brand => {
	  const doc = await brand.save();

	  return doc;
	};
}
export default new BrandService();
