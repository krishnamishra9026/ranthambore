import { matchedData } from 'express-validator/filter';

import utils, { status } from '../../../utils';
import config from '../../../config';
import commonService from '../../../services/common.service';
import emailService from '../../../utils/email.service';
import BaseController from '../base.controller';

class ResourcesController extends BaseController {
  constructor() {
    super('');
  }

  /**
   * @api {get} /resources/countries?keyword=[search] Get a list of countries
   * @apiName GetCountries
   * @apiDescription Get all the countries list.
   * @apiGroup Resources
   *
   * @apiParam {String} [keyword] Search keyword.
   *
   * @apiSuccess {Array[]} countries List of all countries.
   * @apiSuccess {String} countries.id Unique identifier of county.
   * @apiSuccess {String} countries.name Name of county.
   * @apiSuccess {String} countries.code County Code.
   */
  countries = async req => {
    const condition = { active: { $eq: true }, deleted: { $ne: true } };
    const postData = matchedData(req);
    if (postData.keyword) {
      condition.name = new RegExp(`^${postData.keyword}`, 'gi');
    }

    const records = await commonService.getCountries(condition, ['name', 'code']);
    return this.sendResponse(status.OK, true, '', {
      countries: records.map(record => ({
        id: record._id,
        name: utils.unescape(record.name),
        code: utils.unescape(record.code),
      })),
    });
  };

  /**
   * @api {get} /resources/states/:id?keyword=[search] Get a list of states.
   * @apiName GetStates
   * @apiDescription Get a list of states of a country.
   * @apiGroup Resources
   *
   * @apiParam {String} id Unique identifier of country.
   * @apiParam {String} [keyword] Search keyword.
   *
   * @apiSuccess {Array[]} states List of all states.
   * @apiSuccess {String} states.id Unique identifier of state.
   * @apiSuccess {String} states.name Name of state.
   */
  getStates = async req => {
    const condition = {
      country: { $eq: req.params.id },
      active: { $eq: true },
      deleted: { $ne: true },
    };
    const postDate = matchedData(req);
    if (postDate.keyword) {
      condition.name = new RegExp(`^${postDate.keyword}`, 'gi');
    }
    const records = await commonService.getStates(condition, ['name']);
    return this.sendResponse(status.OK, true, '', {
      states: records.map(record => ({
        id: record._id,
        name: utils.unescape(record.name),
      })),
    });
  };

  /**
   * @api {get} /resources/cities/:id?keyword=[search] Get a list of cities.
   * @apiName GetCities
   * @apiDescription Get a list of cities for state.
   * @apiGroup Resources
   *
   * @apiParam {String} id Unique identifier of state.
   * @apiParam {String} [keyword] Search keyword.
   *
   * @apiSuccess {Array[]} cities List of all cities.
   * @apiSuccess {String} cities.id Unique identifier of city.
   * @apiSuccess {String} cities.name Name of city.
   */
  getCities = async req => {
    const condition = {
      state: { $eq: req.params.id },
      active: { $eq: true },
      deleted: { $ne: true },
    };
    const postDate = matchedData(req);
    if (postDate.keyword) {
      condition.name = new RegExp(`^${postDate.keyword}`, 'gi');
    }
    const records = await commonService.getCities(condition, ['name']);
    return this.sendResponse(status.OK, true, '', {
      cities: records.map(record => ({
        id: record._id,
        name: utils.unescape(record.name),
      })),
    });
  };

  /**
   * @api {get} /resources/banners/:category Get a list of banners.
   * @apiName GetBanners
   * @apiDescription Get a list of banners for given category.
   * @apiGroup Resources
   *
   * @apiParam {String} category Unique slug identifier of category.
   *
   * @apiSuccess {Array[]} banners List of all banners.
   * @apiSuccess {String} banners.title Title.
   * @apiSuccess {String} banners.description Description.
   * @apiSuccess {String} banners.url Redirect URL.
   * @apiSuccess {String} banners.image Image url.
   */
  banners = async req => {
    const postDate = matchedData(req);
    const banners = await commonService.getBanners(postDate);
    return this.sendResponse(status.OK, true, '', {
      banners: banners.map(item => ({
        title: item.title ? utils.unescape(item.title) : '',
        description: item.description ? utils.unescape(item.description) : '',
        url: utils.unescape(item.url),
        image: item.image ? `${config.s3.webUrl}/${config.uploadPath.banners}${item.image}` : '',
      })),
    });
  };

  /**
   * @api {get} /resources/page/:slug Gets a page detail.
   * @apiName GetPage
   * @apiDescription Get a page detail for given slug.
   * @apiGroup Resources
   *
   * @apiParam {String} slug Unique slug identifier of page.
   *
   * @apiSuccess {Object} page Page detail.
   * @apiSuccess {String} page.title Title.
   * @apiSuccess {String} page.description Description.
   * @apiSuccess {String} page.metadata.title Meta title for page.
   * @apiSuccess {String} page.metadata.description Meta description for page.
   * @apiSuccess {String} page.metadata.keyword Meta keyword for page.
   */
  getPage = async req => {
    const postDate = matchedData(req);
    const condition = {
      url: postDate.slug,
    };
    const page = await commonService.getPage(condition, ['name', 'metadata', 'description']);
    if (!page) {
      return this.sendResponse(status.OK, false, 'Page data not found!', {
        page: null,
      });
    }
    return this.sendResponse(status.OK, true, '', {
      page: {
        title: utils.unescape(page.name),
        description: utils.unescape(page.description),
        metadata: {
          title: page.metadata.title ? utils.unescape(page.metadata.title) : '',
          description: page.metadata.description ? utils.unescape(page.metadata.description) : '',
          keyword: page.metadata.keyword ? utils.unescape(page.metadata.keyword) : '',
        },
      },
    });
  };

  /**
   * @api {post} /resources/contact-us Submit contact us detail.
   * @apiName SetContactUs
   * @apiDescription Set a contact us request.
   * @apiGroup Resources
   *
   * @apiParam {String} name User's name.
   * @apiParam {String} email User's email.
   * @apiParam {String} number User's contact umber.
   * @apiParam {String} message Message from user.
   */
  contactUs = async req => {
    const data = matchedData(req);
    const contact = await commonService.contactUs(data);

    if (!contact) {
      return this.sendResponse(status.OK, false, 'Error occured while submitting request!', {});
    }
    if (contact.email) {
      const variables = utils.replaceCompanyVariables(req);
      variables.push(
        { item: 'name', value: contact.name },
        { item: 'email', value: contact.email },
        { item: 'number', value: contact.number },
        { item: 'message', value: contact.message },
      );
      await emailService(contact.email, 'CONTACT_US_EMAIL', variables);
    }
    return this.sendResponse(status.OK, true, 'Your request submitted successfully.', {});
  };
}
export default ResourcesController;
