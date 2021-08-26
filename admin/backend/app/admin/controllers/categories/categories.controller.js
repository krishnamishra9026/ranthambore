import { matchedData } from 'express-validator/filter';
import httpStatus from 'http-status';
import utils from '../../../utils';
import categoriesService from '../../services/categories.service';
import objectService from '../../services/object.service';

import BaseController from '../base.controller';

class CategoriesController extends BaseController {
  constructor() {
    super('Category');
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
	getCategoryData = (req, postData) => {
	  const category = {
	    name: postData.name,
	    description: postData.description,
	  };
	  return category;
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
	  const doc = await categoriesService.list(req);
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
	  const category = this.getCategoryData(req, postData);
	  if (postData.parent) {
	    category.parent = postData.parent;
	  }

	  category.active = postData.active;
	  category.createdBy = req.user._id;
	  const categoryId = await categoriesService.create(category);
	  if (!categoryId) {
	    return this.throwError(httpStatus.BAD_GATEWAY, true, this.messages.INSERT_ERROR);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.INSERT_SUCCESS, { id: categoryId });
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
	update = async req => {
	  const postData = req.body;
	  const Category = await categoriesService.getById(req.params.id);

	  if (Category) {
	    const category = this.getCategoryData(req, postData);
	    Category.active = postData.active;
	    Category.updatedBy = req.user._id;
	    Category.name = category.name;
	    Category.description = category.description;
	    Category.parent = postData.parent;
	    // if (postData.parent) {
	    //   Category.parent = postData.parent;
	    // }

	    const doc = await categoriesService.update(Category);
	    if (doc) {
	      return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, doc);
	    }
	    return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	  }

	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	getById = async req => {
	  const category = await categoriesService.model.findById(req.params.id);
	  if (category) {
	    const doc = objectService.getCategoryDetailObject(category);

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
	  const cats = await categoriesService.model.find(condition, selectList);

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
	  const cats = await categoriesService.model.find(condition, selectList);
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
	  const update = await categoriesService.changeStatus(data);
	  if (!update) {
	    return this.throwError(httpStatus.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};
}

export default CategoriesController;
