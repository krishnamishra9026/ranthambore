import Category from '../../models/category.model';
import utils from '../../utils';
import BaseService from '../../services/base.service';
import objectService from './object.service';

class CategoriesService extends BaseService {
  constructor() {
    super(Category);
  }

	getByCondition = (query, options) => Category.paginate(query, options);

	changeStatus = async data => {
	  if (data.status === 'Delete') {
	    const category = await this.updateStatus(data.ids, { deleted: true });
	    return category;
	  }
	  const status = data.status === 'Active';
	  const category = await this.updateStatus(data.ids, { active: status });
	  return category;
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
	    description: 10,
	    sort_order: 1,
	    parent: 1,
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
	      $or: [{ name: new RegExp(`.*${keyword}.*`, 'gi') }, { description: new RegExp(`.*${keyword}.*`, 'gi') }],
	    });
	  }

	  const result = await this.getByCondition(
	    {
	      $and: AND,
	    },
	    {
	      select: selectFields,
	      populate: [
	        {
	          path: 'parent',
	          select: {
	            name: 1,
	          },
	        },
	      ],
	      sort,
	      offset,
	      limit,
	    },
	  );
	  const docs = [];
	  if (result.docs.length) {
	    result.docs.forEach(option => {
	      const doc = objectService.getCateogryObject(option, true);
	      docs.push(doc);
	    });
	    result.docs = docs;
	    return result;
	  }
	  return result;
	};

	create = async category => {
	  const categories = await this.model.create(category);
	  return categories;
	};

	update = async category => {
	  const doc = await category.save();

	  return doc;
	};
}

export default new CategoriesService();
