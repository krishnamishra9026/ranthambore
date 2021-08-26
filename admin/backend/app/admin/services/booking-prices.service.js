import BookingPrices from '../../models/bookingPrice.model';
import utils from '../../utils';
import BaseService from '../../services/base.service';
import objectService from './object.service';

class BookingPricessService extends BaseService {
  constructor() {
    super(BookingPrices);
  }

	getByCondition = (query, options) => BookingPrices.paginate(query, options);

	changeStatus = async data => {
	  if (data.status === 'Delete') {
	    const bookingprices = await this.updateStatus(data.ids, { deleted: true });
	    return bookingprices;
	  }
	  const status = data.status === 'Active';
	  const bookingprices = await this.updateStatus(data.ids, { active: status });
	  return bookingprices;
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
	      const doc = objectService.getBookingPricesObject(option, true);
	      docs.push(doc);
	    });
	    result.docs = docs;
	    return result;
	  }
	  return result;
	};

	create = async bookingprices => {
	  const bookingpricess = await this.model.create(bookingprices);
	  return bookingpricess;
	};

	update = async bookingprices => {
	  const doc = await bookingprices.save();

	  return doc;
	};
}

export default new BookingPricessService();
