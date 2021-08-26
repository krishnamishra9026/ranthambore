/**
 * @apiDefine authHeader
 * @apiHeader (Header) {String} Authorization Bearer [token]
 */

/**
 * @apiDefine multipartHeader
 * @apiHeader (Header) {String} Content-Type multipart/form-data
 */

/**
 * @apiDefine pagingResponse
 *
 * @apiSuccess {Array} docs The result data.
 * @apiSuccess {Number} page Page identifier.
 * @apiSuccess {Number} total Total number of results in the list.
 * @apiSuccess {Number} limit No of records per page.
 * @apiSuccess {Number} pages Total number of pages.
 */

/**
 * @apiDefine pagingParams
 *
 *  @apiParam {String} page Page identifier.
 *  @apiParam {String} count No of records perpage.

 */
