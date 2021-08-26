import MessageService from '../../services/message.service';

class BaseController {
  constructor(entity) {
    this.messages = new MessageService(entity);
  }

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
}

export default BaseController;
