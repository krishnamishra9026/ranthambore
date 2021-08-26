import { matchedData } from 'express-validator/filter';

import BaseController from '../base.controller';
import productService from '../../services/product.service';
import objectService from '../../services/object.service';
import utils, { status } from '../../../utils';
import config from '../../../config';

class Products extends BaseController {
  constructor() {
    super('Products');
  }

	create = async req => {
	  const postData = matchedData(req);
	  const product = await productService.create(req, postData);
	  return this.sendResponse(status.OK, true, product, this.messages.INSERT_SUCCESS, product);
	};

	update = async req => {
	  const postData = matchedData(req);
	  const product = await productService.update(req, postData);
	  if (product) {
	    return this.sendResponse(status.OK, true, this.messages.UPDATE_SUCCESS, product);
	  }
	  return this.throwError(status.OK, false, this.messages.NOT_FOUND);
	};

	uploadImage = async req => {
	  const postData = matchedData(req);
	  const image = await productService.uploadImage(req, postData);
	  if (image) {
	    return this.sendResponse(status.OK, true, this.messages.UPDATE_SUCCESS, image);
	  }
	  return this.throwError(status.OK, false, this.messages.NOT_FOUND);
	};

	deleteImage = async req => {
	  const deleteImage = await productService.deleteImage(req);
	  if (deleteImage) {
	    return this.sendResponse(status.OK, true, this.messages.IMAGE_DELETE);
	  }
	  return this.throwError(status.OK, false, this.messages.IMAGE_NOT_DELETE);
	};

	list = async req => {
	  const products = await productService.list(req);
	  return this.sendResponse(status.OK, true, this.messages.LIST_SUCCESS, utils.getPagination(products));
	};

	getById = async req => {
	  const product = await productService.model
	    .findById(req.params.id)
	    .populate([
	      {
	        path: 'category',
	        select: { name: 1 },
	      },
	      {
	        path: 'subCategory',
	        select: { name: 1 },
	      },
	    ])
	    .lean();

	  if (product) {
	    const doc = await objectService.getProductDetailObject(product);
	    return this.sendResponse(status.OK, true, this.messages.DETAILS_SUCCESS, doc);
	  }
	  return this.throwError(status.OK, false, this.messages.NOT_FOUND);
	};

	imageList = async req => {
	  const product = await productService.model.findById({ _id: req.params.id }).lean();

	  if (product) {
	    const doc = product.images.map(ele => {
	      if (ele.name) {
	        ele.name = `${config.s3.webUrl}/${config.uploadPath.products}${ele.name}`;
	      }
	      return ele;
	    });
	    return this.sendResponse(status.OK, true, '', { images: doc });
	  }
	  return this.sendResponse(status.OK, true, '', { images: [] });
	};

	changeStatus = async req => {
	  const update = await productService.changeStatus(req);
	  if (!update) {
	    return this.throwError(status.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
	  }
	  return this.sendResponse(status.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};

	makeDefaultImage = async req => {
	  const products = await productService.model.findOne({
	    'images._id': req.params.id,
	  });

	  if (products) {
	    products.images.forEach(ele => {
	      if (ele._id.toString() === req.params.id.toString()) {
	        ele.isDefault = true;
	      } else {
	        ele.isDefault = false;
	      }
	    });
	    products.updatedBy = req.user._id;
	    await products.save();
	  }
	  return this.sendResponse(status.OK, true, this.messages.DEFAULT_IMAGE_SET, {});
	};
}
export default Products;
