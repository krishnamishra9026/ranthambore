import bcrypt from 'bcrypt';
import url from 'url';
import moment from 'moment';
import httpStatus from 'http-status';
import { validator as expressValidator } from 'express-validator';
import Debug from 'debug';

const { validationResult } = require('express-validator/check');

const saltRounds = 10;

class Utils {
	errorFormatterFun = error => ({
	  param: error.param,
	  message: error.msg,
	});

	escape = str => expressValidator.escape(str);

	unescape = str => expressValidator.unescape(str);

	checkFileSizeInMB = (size, sizeInMB) => {
	  if (size < 1024 * 1024 * sizeInMB) {
	    return true;
	  }
	  const error = new Error('The file size exceeds the limit allowed and cannot be saved');
	  error.code = httpStatus.REQUEST_ENTITY_TOO_LARGE;
	  throw error;
	};

	getAge = date => {
	  if (date) {
	    const birthdate = moment(date, 'YYYY-MM-DD');
	    return moment().diff(birthdate, 'years');
	  }
	  return 0;
	};

	customResponse = (res, response, statusCode) => res
	    .status(statusCode || 200)
	    .send(response)
	    .end();

	successWithProperty = (res, message, response, statusCode) => res
	    .status(statusCode || 200)
	    .send(
	      Object.assign(
	        {
	          message: message || 'Success',
	          success: true,
	          data: null,
	        },
	        response,
	      ),
	    )
	    .end();

	errorWithProperty = (res, message, response, statusCode) => res
	    .status(statusCode || 200)
	    .send(
	      Object.assign(
	        {
	          message: message || 'Error',
	          success: false,
	          data: null,
	        },
	        response,
	      ),
	    )
	    .end();

	getValidationResult = (req, res) => new Promise(resolve => {
	    try {
	      validationResult(req).throw();
	      return resolve(true);
	    } catch (err) {
	      err.formatWith(this.errorFormatterFun);
	      const error = err.mapped({ onlyFirstError: true });
	      return this.errorWithProperty(res, error[Object.keys(error)[0]].message, {
	        errors: error,
	      });
	    }
	  });

	replaceCompanyVariables = req => [
	  { item: 'siteName', value: this.getSiteSetting(req, 'COMPANY_NAME') },
	  { item: 'siteUrl', value: this.getSiteSetting(req, 'COMPANY_WEBSITE') },
	];

	formatNumber = number => number.toFixed(2);

	getDateInFormat = (date, format, fromFormat) => {
	  let day = moment(date);
	  if (fromFormat) {
	    day = moment(date, fromFormat);
	  }
	  return day.format(format || 'YYYY-MM-DD HH:mm:ss');
	};

	getPagination = entity => {
	  if (entity.docs) {
	    const offset = parseInt(entity.offset, 10) + entity.limit;
	    return {
	      docs: entity.docs,
	      total: parseInt(entity.total, 10),
	      page: parseInt(parseInt(entity.offset, 10) / parseInt(entity.limit, 10), 10),
	      offset: offset < entity.total ? offset : -1,
	      next: offset < entity.total,
	    };
	  }
	  return {
	    docs: [],
	    total: 0,
	    page: 0,
	    offset: 0,
	    next: false,
	  };
	};

	respondResultWithPaging = () => entity => {
	  let data = null;
	  if (entity.docs) {
	    const offset = parseInt(entity.offset, 10) + entity.limit;
	    data = {
	      docs: entity.docs,
	      total: parseInt(entity.total, 10),
	      page: parseInt(parseInt(entity.offset, 10) / parseInt(entity.limit, 10), 10),
	      offset: offset < entity.total ? offset : -1,
	      next: offset < entity.total,
	    };
	    return {
	      success: true,
	      data,
	      message: false,
	    };
	  }
	  data = {
	    docs: [],
	    total: 0,
	    page: 0,
	    next: false,
	  };
	  return {
	    success: true,
	    data,
	    message: 'Data not found!',
	  };
	};

	getPasswordHash = password => bcrypt.hashSync(password, saltRounds);

	handleEntityNotFound = (res, entity) => res
	    .status(200)
	    .json({
	      success: true,
	      data: [],
	      message: entity ? `${entity} not found!` : 'Record not found!',
	    })
	    .end();

	handleError = (res, err) => {
	  let errors = '';
	  if (err.errors) {
	    errors = err.errors[Object.keys(err.errors)[0]].message;
	  }
	  if (!errors && err.message !== '') {
	    errors = err.message;
	  }

	  /* eslint no-console: ["off"] */
	  console.error(`Error ===> ${errors}`);
	  return this.errorWithProperty(res, errors);
	};

	generateSlug = item => item
	    .toLowerCase()
	    .replace(/[^a-z0-9-\s]/g, '')
	    .replace(/\s+/g, '-')
	    .trim();

	sanitizeUniqueName = item => item
	    .toLowerCase()
	    .replace(/[^a-z0-9-\s]/g, '')
	    .replace(/\s+/g, '_')
	    .trim();

	getImageName = name => name
	    .toLowerCase()
	    .replace(/[^a-z0-9.-_\s]/g, '')
	    .replace(/\s+/g, '-');

	getFileExtension = name => {
	  const names = name.split('.');
	  return `.${names[names.length - 1]}`;
	};

	getSiteSetting = (req, key) => {
	  const value = req.app.get(key);
	  if (value) {
	    return value;
	  }
	  return '';
	};

	GenerateCode = () => {
	  let text = '';
	  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  for (let i = 0; i < 50; i += 1) {
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	  }
	  return text;
	};

	fullUrl = req => url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	  });

	checkFileSizeInMB = (size, sizeInMB) => {
	  if (size < 1024 * 1024 * sizeInMB) {
	    return true;
	  }
	  const error = new Error('The file size exceeds the limit allowed and cannot be saved');
	  error.code = httpStatus.REQUEST_ENTITY_TOO_LARGE;
	  throw error;
	};
}
export default new Utils();

export const log = Debug('express:api');

export const status = httpStatus;
