import BaseService from '../../services/base.service';
import utils from '../../utils';
import SystemEmails from '../../models/systemEmails.model';

class SystemEmailService extends BaseService {
  constructor() {
    super(SystemEmails);
  }

  getByCondition = (query, options) => this.model.paginate(query, options);

  create = async data => {
    try {
      const result = await this.model.create(data);

      return { id: result.id };
    } catch (err) {
      err.code = 404;
      throw err;
    }
  };

  list = async req => {
    let keyword = req.body.keyword || '';
    keyword = utils.escape(keyword.trim());
    const offset = parseInt(req.body.offset, 10) || 0;
    const limit = parseInt(req.body.limit, 10) || 10;
    let sort = { created: 'desc' };
    const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];

    if (
      sortKey.length
      && ['title', 'code', 'subject', 'fromName', 'fromEmail'].indexOf(sortKey[0]) > -1
    ) {
      sort = {};
      sort[sortKey] = req.body.sort[sortKey];
    }

    const selectFields = ['title', 'code', 'subject', 'fromName', 'fromEmail'];

    const AND = [{ _id: { $exists: true } }];

    if (keyword) {
      AND.push({
        $or: [
          { title: new RegExp(`.*${keyword}.*`, 'gi') },
          { code: new RegExp(`.*${keyword}.*`, 'gi') },
          { subject: new RegExp(`.*${keyword}.*`, 'gi') },
          { fromName: new RegExp(`.*${keyword}.*`, 'gi') },
          { fromEmail: new RegExp(`.*${keyword}.*`, 'gi') },
        ],
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

    if (result && result.docs.length) {
      const docs = [];
      result.docs.forEach(row => {
        docs.push({
          id: row._id,
          title: utils.unescape(row.title),
          subject: utils.unescape(row.subject),
          code: utils.unescape(row.code),
          fromName: utils.unescape(row.fromName),
          fromEmail: utils.unescape(row.fromEmail),
        });
      });
      result.docs = docs;
      return result;
    }
    return result;
  };
}

export default new SystemEmailService();
