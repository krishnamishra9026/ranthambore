import { matchedData } from 'express-validator/filter';
import httpStatus from 'http-status';
import cambalBookingDetail from '../../../models/cambal-booking-detail.model';
import cambalBooking from '../../../models/cambal-booking.model';
import utils from '../../../utils';
import CambalBookingService from '../../services/cambal-booking.service';
import objectService from '../../services/object.service';

import BaseController from '../base.controller';

class CambalBookingsController extends BaseController {

	

  constructor() {
    super('Customer');
  }



	/**
	 * @api {post} /categories Get Detail
	 * @apiName GetCategoryDetail
	 * @apiDescription Service to get Category detail
	 * @apiGroup Category
	 * @apiUse authHeader
	 * @apiParam {String} id Unique identifier for customer.
	 * @apiUse CategoryListDetail
	 */
	getCustomerData = (req, postData) => {
	  const customer = {
		name: postData.name,
		address: postData.address,
		email : postData.email,
	    mobile: postData.mobile,
	  };
	  return customer;
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
	  const doc = await CambalBookingService.list(req);
	  return this.sendResponse(httpStatus.OK, true, this.messages.LIST_SUCCESS, utils.getPagination(doc));
	};



	changeStatus = async req => {

	  const update = await CambalBookingService.changeStatus(req.body);
	  if (!update) {
	    return this.throwError(httpStatus.OK, false, this.messages.STATUS_NOT_UPDATE_SUCCESS);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.STATUS_UPDATE_SUCCESS, {});
	};

	generatePdfFile = async req => {
		var pdf = require("pdf-creator-node");
		var fs = require('fs');
		var html = fs.readFileSync(__dirname+'/template.html', 'utf8');
		
		var options = {
			format: "A3",
			orientation: "portrait",
			border: "10mm"
		};


		const { MongoClient } = require('mongodb');
		const customer = await CambalBookingService.model.findById(req.params.id);
		const client = await MongoClient.connect('mongodb://127.0.0.1:27017/ranthamboredb');
		const db = client.db('ranthamboredb');
		var mongo = require('mongodb');
		var ooid = new mongo.ObjectID(req.body.customer_id);

		const cambal_voucher_docs = await db.collection('cambal_vouchers').findOne({ name: "cambal_voucher_no" });

		if(cambal_voucher_docs){
			var voucherno = cambal_voucher_docs.value;
		}else{
			var voucherno = 1;
		}

		const get_total_num_docs = await  db.collection('cambalBooking').find({'_id' : ooid }).count();

		const order_docs = await db.collection('cambalBooking').findOne({'_id' : ooid });



		var newdate = new Date(order_docs.date);

		var dd = String(newdate.getDate()).padStart(2, '0');
		var mm = String(newdate.getMonth() + 1).padStart(2, '0'); 
		var yyyy = newdate.getFullYear();
		newdate = dd + '-' + mm + '-' + yyyy;	

		order_docs.date =  newdate;		
		var new_order_doc = [];
		new_order_doc.push(order_docs);

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); 
		var yyyy = today.getFullYear();
		today = dd + '-' + mm + '-' + yyyy;
		
		new_order_doc.count = order_docs.no_of_persons_indian + order_docs.no_of_persons_foreigner;
		new_order_doc.zone = req.body.zone;
		new_order_doc.date = today;
		new_order_doc.cambal_voucher_no = voucherno;

		var document = {
			html: html,
			data: {
				myData: new_order_doc
			},
			path: __dirname.split('backend/')[0]+'uploads/vocher_files/cambal_voucher_'+req.body.customer_id+'.pdf'
		};

		var res_re = pdf.create(document, options)
		.then(res => { 
			
			db.collection('cambal_vouchers').update(
				{ name: "cambal_voucher_no" },
				{ $inc: { value: 1 } }
			);
	
		})
		.catch(error => {
			//return this.throwError(httpStatus.BAD_GATEWAY, true, this.messages.INSERT_ERROR);
		});
		var file_path ='uploads/vocher_files/cambal_voucher_'+req.body.customer_id+'.pdf';
		return this.sendResponse(httpStatus.OK, true, file_path , ['File generated Success']);
	};

	sendVoucher = async req => {

		var customerId = req.body.customer_id;
		const fs = require('fs')
	
		const path = __dirname.split('backend/')[0]+'uploads/vocher_files/cambal_voucher_'+req.body.customer_id+'.pdf'
		
		const nodemailer = require("nodemailer");
	
		let transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'n2rtech785612@gmail.com',
				pass: 'Temp@785612'
			}
		});
		
		const { MongoClient } = require('mongodb');
		const customer = await CambalBookingService.model.findById(req.params.id);
		const client = await MongoClient.connect('mongodb://127.0.0.1:27017/ranthamboredb');
		const db = client.db('ranthamboredb');
		var mongo = require('mongodb');
		var ooid = new mongo.ObjectID(req.body.customer_id);
		
		
		const order_docs = await db.collection('Customer').findOne({'_id' : ooid });

		var customer_name = order_docs.name;

		const message = {
			from: 'ranthambore360@gmail.com',
			to: order_docs.email,
			subject: 'Ranthambore Jungle Safari ( Ranthambore National Park ) Booking Voucher',
			html: '<p>Dear, '+ order_docs.name +'<br></br>Kindly Check Your Safari Voucher in attachment.<br></br>Also Contact Your Safari Contact Person before one day for confirming reporting point.<br></br><br></br>Regards, Ranthambore Jungle Safari ( Ranthambore National Park ) Team.</p>',
			attachments: [{
				filename: 'voucher.pdf',
				path: path
			}]
		};
		transport.sendMail(message, function(err, info) {
			//console.log(info);
			/*if(info.response){
				return this.sendResponse(httpStatus.OK, 'Voucheer sended on mail Successfully!', path, []);
			}else{
				return this.throwError(httpStatus.BAD_GATEWAY, true, 'Voucher not sended try again!!');
			}*/
			
		});
		return this.sendResponse(httpStatus.OK, 'Voucheer sended on mail Successfully!', path, []);	
	}
	

	getPdfFile = async req => {

		var customerId = req.body.customer_id;
		const fs = require('fs')

		const path = __dirname.split('backend/')[0]+'uploads/vocher_files/cambal_voucher_'+req.body.customer_id+'.pdf';
		
		var file_path ='uploads/vocher_files/cambal_voucher_'+req.body.customer_id+'.pdf';
		try {
			await fs.promises.access(path);
			return this.sendResponse(httpStatus.OK, true, file_path, ['Found']);
		} catch (error) {
			return this.sendResponse(httpStatus.OK, true, false, ['Not Found']);
		}

	}


	create = async req => {
	  const postData = req.body;
	  const customer = this.getCustomerData(req, postData);
	  if (postData.parent) {
	    customer.parent = postData.parent;
	  }

	  customer.active = postData.active;
	  customer.createdBy = req.user._id;
	  const customerId = await CambalBookingService.create(customer);
	  if (!customerId) {
	    return this.throwError(httpStatus.BAD_GATEWAY, true, this.messages.INSERT_ERROR);
	  }
	  return this.sendResponse(httpStatus.OK, true, this.messages.INSERT_SUCCESS, { id: customerId });
	};




	update = async req => {
	  const postData = req.body;
	  const Category = await CambalBookingService.getById(req.params.id);

	  if (Category) {
	    const customer = this.getCustomerData(req, postData);
	    Category.active = postData.active;
	    Category.updatedBy = req.user._id;
	    Category.name = customer.name;
	    Category.description = customer.description;
	    Category.parent = postData.parent;
	    // if (postData.parent) {
	    //   Category.parent = postData.parent;
	    // }

	    const doc = await CambalBookingService.update(Category);
	    if (doc) {
	      return this.sendResponse(httpStatus.OK, true, this.messages.UPDATE_SUCCESS, doc);
	    }
	    return this.throwError(httpStatus.OK, false, this.messages.UPDATE_ERROR);
	  }

	  return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

	getById = async req => {		
		const { MongoClient } = require('mongodb');
		const customer = await CambalBookingService.model.findById(req.params.id);
		const client = await MongoClient.connect('mongodb://127.0.0.1:27017/ranthamboredb');
		const db = client.db('ranthamboredb');
		var mongo = require('mongodb');
		var ooid = new mongo.ObjectID(req.params.id);
		const docs = await db.collection('cambalBooking').find({ '_id': ooid }).toArray();

		if (customer) {
			const doc = objectService.getcambalBookingObject(customer);
			return this.sendResponse(httpStatus.OK, true, this.messages.DETAILS_SUCCESS, docs);
		}
		return this.throwError(httpStatus.OK, false, this.messages.NOT_FOUND);
	};

}

export default CambalBookingsController;
