import Event from '../../models/event.model';
import utils from '../../utils';
import BaseService from '../../services/base.service';
import objectService from './object.service';

class EventsService extends BaseService {
  constructor() {
    super(Event);
  }

	getByCondition = (query, options) => Event.paginate(query, options);

	changeStatus = async data => {
	  if (data.status === 'Delete') {
	    const event = await this.updateStatus(data.ids, { deleted: true });
	    return event;
	  }
	  const status = data.status === 'Active';
	  const event = await this.updateStatus(data.ids, { active: status });
	  return event;
	};

	list = async req => {
	  const filters = req.body.filters || [];
	  let keyword = req.body.keyword || '';
	  keyword = utils.escape(keyword.trim());
	  const offset = parseInt(req.body.offset, 10) || 0;
	  const limit = parseInt(req.body.limit, 10) || 10;
	  let sort = { date: 'desc' };
	  const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];

	  if (sortKey.length && ['date', 'zone'].indexOf(sortKey[0]) > -1) {
	    sort = {};
	    if (sortKey[0] === 'date') {
	      sort.date = req.body.sort.date;
	    } else {
	      sort[sortKey] = req.body.sort[sortKey];
	    }
	  }

	  const selectFields = {
	    date: 1,
	    zone: 10,
	    vehicle: 10,
	    timing: 10,
	    availability: 10,
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
	      $or: [{ date: new RegExp(`.*${keyword}.*`, 'gi') }, { description: new RegExp(`.*${keyword}.*`, 'gi') }],
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
	      const doc = objectService.getEventObject(option, true);
	      docs.push(doc);
	    });
	    result.docs = docs;
	    return result;
	  }
	  return result;
	};

	create = async event => {
	  const events = await this.model.create(event);
	  return events;
	};

	update = async event => {
	  const doc = await event.save();

	  return doc;
	};
}

export default new EventsService();
