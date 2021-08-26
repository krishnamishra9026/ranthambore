import { matchedData } from 'express-validator/filter';
import httpStatus from 'http-status';
import BaseController from '../base.controller';
import FAQServices from '../../services/faq.service';
import objectService from '../../services/object.service';
import utils, { status } from '../../../utils';

class FAQController extends BaseController {
  constructor() {
    super('FAQ');
  }

	getFAQData = (req, postData) => {
	  const faq = {
	    question: postData.question,
	    answer: postData.answer,
	    seq_no: postData.seq_no,
	    active: postData.active,
	  };
	  return faq;
	};

	/**
	 * @api {post} /faq Create
	 * @apiDescription Service to create faq
	 * @apiName CreateFaq
	 * @apiGroup Faq
	 *
	 *
	 * @apiUse authHeader
	 * @apiUse FaqObject
	 */
	create = async req => {
	  const postData = req.body;
	  const faq = this.getFAQData(req, postData);
	  faq.active = postData.active;
	  faq.createdBy = req.user._id;
	  const result = await FAQServices.create(postData);
	  if (result) {
	    return this.sendResponse(httpStatus.OK, true, this.messages.INSERT_SUCCESS, {});
	  }
	  return this.throwError(httpStatus.OK, false, this.messages.INSERT_ERROR);
	};
	/**
	 * @api {put} /faq/:id Update
	 * @apiDescription Service to update faq
	 * @apiName UpdateFaq
	 * @apiGroup Faq
	 * @apiUse authHeader
	 * @apiUse FaqObject
	 * @apiParam {String} id Unique identifier of faq.
	 *
	 */

	update = async req => {
	  const data = req.body;
	  const FAQ = await FAQServices.getById(req.params.id);
	  if (FAQ) {
	    const faq = this.getFAQData(req, data);
	    FAQ.answer = faq.answer;
	    FAQ.question = faq.question;
	    FAQ.active = faq.active;
	    FAQ.seq_no = faq.seq_no;
	    FAQ.updatedBy = req.user._id;
	    const doc = await FAQServices.update(FAQ);
	    if (doc) {
	      return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, doc);
	    }
	    return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	  }
	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	/**
	 * @api {post} /faq/list List all
	 * @apiName FaqCustomer
	 * @apiDescription Searvice to list all faq
	 * @apiGroup Faq
	 * @apiUse authHeader
	 * @apiUse pagingResponse
	 * @apiUse FaqListDetail
	 */
	list = async req => {
	  const doc = await FAQServices.list(req);
	  return this.sendResponse(httpStatus.OK, true, this.messages.LIST_SUCCESS, utils.getPagination(doc));
	};

	/**
	 * @api {get} /faq/:id Get Detail
	 * @apiName GetFaqDetail
	 * @apiDescription Service to get faq detail based on unique identifier
	 * @apiGroup Faq
	 * @apiUse authHeader
	 * @apiParam {String} id Unique identifier for faq.
	 * @apiUse FaqObject
	 */
	getById = async req => {
	  const record = await FAQServices.model.findById(req.params.id);
	  if (record) {
	    const doc = objectService.getFaqDetailObject(record);

	    return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, doc);
	  }

	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	changeStatus = async req => {
	  const data = matchedData(req);
	  const update = FAQServices.changeStatus(data);
	  if (!update) {
	    return this.throwError(httpStatus.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};
}

export default FAQController;
