class BaseService {
  constructor(model) {
    this.model = model;
  }

  filterParams = (params, whitelist) => {
    const filtered = {};
    Object.keys(params).forEach(key => {
      if (whitelist.indexOf(key) > -1) {
        filtered[key] = params[key];
      }
    });
    return filtered;
  };

  formatApiError = err => {
    if (!err) {
      // eslint-disable-next-line no-console
      return console.error('Provide an error');
    }

    const formatted = {
      message: err.message,
    };

    if (err.errors) {
      formatted.errors = {};
      const { errors } = err;
      Object.keys(errors).forEach(type => {
        formatted.errors[type] = errors[type].message;
      });
    }

    return formatted;
  };

  /**
   * @param code Error code
   * @param type Error type
   * @param message Error string
   */
  throwError = (code, type, message) => {
    const error = new Error(message || 'Default Error');
    error.code = code;
    error.type = type;
    throw error;
  };

  throwIf = (fn, code, errorType, errorMessage) => result => {
    if (fn(result)) {
      return this.throwError(code, errorType, errorMessage)();
    }
    return result;
  };

  sendSuccess = (res, message) => data => {
    res.status(200).json({ type: 'success', message, data });
  };

  sendError = (res, status, message) => error => {
    res.status(status || error.status).json({
      type: 'error',
      message: message || error.message,
      error,
    });
  };

  /**
   * @param status status code
   * @param success boolean
   * @param message string
   * @param result response data to send
   */
  sendResponse = (status, success, message, result) => ({
    status,
    success,
    data: result,
    message,
  });

  updateStatus = (ids, status) => this.model.updateMany(
    {
      _id: { $in: ids },
    },
    status,
    { multi: true },
  );

  getById = id => this.model.findById(id);

  fieldByCondition = (condition, fields) => this.model.find(condition, fields);
}

export default BaseService;
