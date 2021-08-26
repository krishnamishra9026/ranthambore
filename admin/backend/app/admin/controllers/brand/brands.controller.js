import { matchedData } from 'express-validator/filter';
import httpStatus from 'http-status';
import utils from '../../../utils';
import brandService from '../../services/brand.service';
import objectService from '../../services/object.service';

import BaseController from '../base.controller';

class BrandsController extends BaseController {
  constructor() {
    super('Brand');
  }

	/**
	 * @api {post} /brand Get Detail
	 * @apiName GetBrandDetail
	 * @apiDescription Service to get Brand detail
	 * @apiGroup Brand
	 * @apiUse authHeader
	 * @apiParam {String} id Unique identifier for Brand.
	 * @apiUse BrandListDetail
	 */
	getBrandData = (req, postData) => {
	  const brand = {
	    name: postData.name,
	    active: postData.active,
	  };
	  return brand;
	};

	/**
	 * @api {post} /brand List all
	 * @apiName ListBrand
	 * @apiDescription Service to list all Brand
	 * @apiGroup Brand
	 * @apiUse authHeader
	 * @apiUse pagingResponse
	 * @apiUse BrandListDetail
	 */
	list = async req => {
	  const doc = await brandService.list(req);
	  return this.sendResponse(httpStatus.OK, true, this.messages.LIST_SUCCESS, utils.getPagination(doc));
	};

	/**
	 * @api {post} /brand List all
	 * @apiName ListBrand
	 * @apiDescription Service to list all Brand
	 * @apiGroup Brand
	 * @apiUse authHeader
	 * @apiUse pagingResponse
	 * @apiUse BrandListDetail
	 */
	getAll = async () => {
	  const condition = {
	    active: true,
	    deleted: false,
	  };
	  const selectList = {
	    id: 1,
	    name: 1,
	  };
	  const brands = await brandService.model.find(condition, selectList);

	  const allBrands = [];
	  brands.forEach(ele => {
	    allBrands.push(objectService.getBrandObject(ele));
	  });
	  return this.sendResponse(httpStatus.OK, true, '', allBrands);
	};

	/**
	 * @api {post} /Brand Create
	 * @apiDescription Service to create Brand
	 * @apiName CreateBrand
	 * @apiGroup Brand
	 *
	 * @apiUse multipartHeader
	 *
	 * @apiUse authHeader
	 * @apiUse BrandObject
	 */

	create = async req => {
	  const postData = req.body;
	  const brand = this.getBrandData(req, postData);
	  brand.active = postData.active;
	  brand.createdBy = req.user._id;
	  const doc = await brandService.create(brand);
	  if (!doc) {
	    return this.throwError(httpStatus.BAD_GATEWAY, true, this.messages.INSERT_ERROR);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.INSERT_SUCCESS, { id: doc });
	};

	/**
	 * @api {put} /brand/:id Update
	 * @apiDescription Service to update Brand detail.
	 * @apiName UpdateBrand
	 * @apiGroup Brand
	 *
	 * @apiUse multipartHeader
	 *
	 * @apiUse authHeader
	 * @apiUse BrandObject
	 * @apiParam id string Unique identifier of Brand
	 */
	update = async req => {
	  const postData = req.body;
	  const Brand = await brandService.getById(req.params.id);

	  if (Brand) {
	    const brand = this.getBrandData(req, postData);
	    Brand.active = postData.active;
	    Brand.updatedBy = req.user._id;
	    Brand.name = brand.name;

	    const doc = await brandService.update(Brand);
	    if (doc) {
	      return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, doc);
	    }
	    return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	  }

	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	getById = async req => {
	  const brand = await brandService.model.findById(req.params.id);
	  if (brand) {
	    const doc = objectService.getBrandDetailObject(brand);

	    return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, doc);
	  }
	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	/**
	 * @api {post} /brand/change Change status
	 * @apiName ChangebrandStatus
	 * @apiDescription Service to change the status of brand
	 * @apiGroup Brand
	 * @apiUse authHeader
	 * @apiParam {Array[]} data Array of unique identifiers of brand.
	 * @apiParam {String="active","inactive","delete"} Status to update.
	 */
	changeStatus = async req => {
	  const data = matchedData(req);
	  const update = await brandService.changeStatus(data);
	  if (!update) {
	    return this.throwError(httpStatus.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};
}

export default BrandsController;
