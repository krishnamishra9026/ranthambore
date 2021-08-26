import BaseService from '../../services/base.service';
import utils from '../../utils';
import FAQ from '../../models/faq.model';
import objectService from './object.service';

class FAQService extends BaseService {
  constructor() {
    super(FAQ);
  }

	getByCondition = (query, options) => FAQ.paginate(query, options);

	getById = id => this.model.findById(id);

	// create = req => this.model.create(req);

	create = async faq => {
	  const doc = await this.model.create(faq);
	  return doc;
	};

	update = async faq => {
	  const doc = await faq.save();

	  return doc;
	};

	list = async req => {
	  let keyword = req.body.keyword || '';
	  keyword = utils.escape(keyword.trim());
	  const limit = parseInt(req.body.limit, 10) || 10;
	  const sort = { created: 'asc' };
	  const offset = parseInt(req.body.offset, 10) || 0;
	  const AND = [{ deleted: false }];
	  const selectFields = {
	    question: 1,
	    answer: 1,
	    active: 1,
	    seq_no: 1,
	    id: 1,
	  };

	  if (keyword) {
	    AND.push({
	      $or: [{ question: new RegExp(`.*${keyword}.*`, 'gi') }, { answer: new RegExp(`.*${keyword}.*`, 'gi') }],
	    });
	  }
	  const result = await this.getByCondition(
	    {
	      $and: AND,
	    },
	    {
	      selectFields,
	      sort,
	      offset,
	      limit,
	    },
	  );
	  const docs = [];
	  if (result.docs.length) {
	    result.docs.forEach(option => {
	      const doc = objectService.getFaqObject(option, true);
	      docs.push(doc);
	    });
	    result.docs = docs;
	    return result;
	  }
	  return result;
	};

	// changeStatus = async req => {
	//   const data = req.body;
	//   const cust = await this.updateStatus(data.ids, { active: data.active });
	//   return cust;
	// };

	changeStatus = async data => {
	  if (data.status === 'Delete') {
	    const faq = await this.updateStatus(data.ids, { deleted: true });
	    return faq;
	  }
	  const status = data.status === 'Active';
	  const faq = await this.updateStatus(data.ids, { active: status });
	  return faq;
	};
}
export default new FAQService();
