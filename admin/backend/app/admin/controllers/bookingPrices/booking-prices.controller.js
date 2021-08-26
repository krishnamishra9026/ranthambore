import { matchedData } from 'express-validator/filter';
import httpStatus from 'http-status';
import utils from '../../../utils';
import BookingPricesService from '../../services/booking-prices.service';
import objectService from '../../services/object.service';

import BaseController from '../base.controller';

class BookingPricesController extends BaseController {
  constructor() {
    super('BookingPrices');
  }

	/**
	 * @api {post} /categories Get Detail
	 * @apiName GetCategoryDetail
	 * @apiDescription Service to get Category detail
	 * @apiGroup Category
	 * @apiUse authHeader
	 * @apiParam {String} id Unique identifier for category.
	 * @apiUse CategoryListDetail
	 */
	getBookingPricesData = (req, postData) => {
	  const event = {
	  	date: postData.date,
	    zone: postData.zone,
	    vehicle: postData.vehicle,
	    timing: postData.timing,
	    availability: postData.availability,
	  };
	  return event;
	};

	/**
	 * @api {post} /categories List all
	 * @apiName ListCategory
	 * @apiDescription Service to list all Category
	 * @apiGroup Category
	 * @apiUse authHeader
	 * @apiUse pagingResponse
	 * @apiUse CategoryListDetail
	 */
	list = async req => {
	  const doc = await BookingPricesService.list(req);  
	  return this.sendResponse(httpStatus.OK, true, this.messages.LIST_SUCCESS, utils.getPagination(doc));
	};




	/**
	 * @api {post} /category Create
	 * @apiDescription Service to create category
	 * @apiName CreateCategory
	 * @apiGroup Category
	 *
	 * @apiUse multipartHeader
	 *
	 * @apiUse authHeader
	 * @apiUse CategoryObject
	 */

	create = async req => {
	  const postData = req.body;
	  const event = this.getBookingPricesData(req, postData);
	  event.active = postData.active;
	  event.createdBy = req.user._id;
	  const eventId = await BookingPricesService.create(event);
	  if (!eventId) {
	    return this.throwError(httpStatus.BAD_GATEWAY, true, this.messages.INSERT_ERROR);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.INSERT_SUCCESS, { id: eventId });
	};

	/**
	 * @api {put} /categories/:id Update
	 * @apiDescription Service to update category detail.
	 * @apiName UpdateCategory
	 * @apiGroup Category
	 *
	 * @apiUse multipartHeader
	 *
	 * @apiUse authHeader
	 * @apiUse CategoryObject
	 * @apiParam id string Unique identifier of category
	 */

	 updateAvailability = async req => {
	 	const postData = req.body;
	 	const Event = await BookingPricesService.getById(postData.id);
	 	 if (Event) {	   
	    Event.price = postData.value;
	    const doc = await BookingPricesService.update(Event);
	    if (doc) {
	      return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, doc);
	    }
	    return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	  }
	 };


	 uploadCsv = async req => {

	 	console.log(req.body);
	 	console.log('kj');
	 	const postData = req.body;
	 	const Event = await BookingPricesService.getById(postData.id);
	 	if (Event) {	   
	 		Event.availability = postData.value;
	 		const doc = await BookingPricesService.update(Event);
	 		if (doc) {
	 			return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, doc);
	 		}
	 		return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	 	}
	 };

	update = async req => {
	  const postData = req.body;
	  const Event = await BookingPricesService.getById(req.params.id);

	  if (Event) {
	    const event = this.getBookingPricesData(req, postData);
	    Event.active = postData.active;
	    Event.updatedBy = req.user._id;
	    Event.date = event.date;
	    Event.zone = event.zone;
	    Event.vehicle = event.vehicle;
	    Event.timing = event.timing;
	    Event.availability = event.availability;
	    const doc = await BookingPricesService.update(Event);
	    if (doc) {
	      return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, doc);
	    }
	    return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	  }

	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};



	getById = async req => {
		console.log(req.params.id);
	  const category = await BookingPricesService.model.findById(req.params.id);
	  if (category) {
	    const doc = objectService.getEventDetailObject(category);

	    return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, doc);
	  }
	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	parentLists = async req => {
	  const condition = {
	    $or: [{ parent: { $eq: null } }, { parent: { $exists: false } }],
	    active: true,
	    deleted: false,
	  };

	  if (req.params.id !== 'undefined') {
	    condition._id = { $ne: req.params.id };
	  }
	  const selectList = {
	    id: 1,
	    name: 1,
	  };
	  const cats = await BookingPricesService.model.find(condition, selectList);

	  const categories = [];
	  cats.forEach(ele => {
	    categories.push(objectService.getParentCatObject(ele));
	  });
	  return this.sendResponse(httpStatus.OK, true, '', categories);
	};

	getSubCategory = async req => {
	  const condition = {
	    parent: { $eq: req.params.id },
	    active: true,
	    deleted: false,
	  };
	  const selectList = {
	    id: 1,
	    name: 1,
	  };
	  const cats = await BookingPricesService.model.find(condition, selectList);
	  const categories = [];
	  cats.forEach(ele => {
	    categories.push(objectService.getParentCatObject(ele));
	  });
	  return this.sendResponse(httpStatus.OK, true, '', categories);
	};

	/**
	 * @api {post} /categories/change Change status
	 * @apiName ChangeCategoriesStatus
	 * @apiDescription Service to change the status of categories
	 * @apiGroup Category
	 * @apiUse authHeader
	 * @apiParam {Array[]} data Array of unique identifiers of Categories.
	 * @apiParam {String="active","inactive","delete"} Status to update.
	 */

	

	changeStatus = async req => {
	  const data = matchedData(req);
	  const update = await BookingPricesService.changeStatus(data);
	  if (!update) {
	    return this.throwError(httpStatus.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};
}

export default BookingPricesController;
