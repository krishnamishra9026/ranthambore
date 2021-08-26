/**
 * All Message List
 *
 * @export
 * @class MessageService
 * @property {object} messages.
 * @property {string} messages.NOT_FOUND.
 * @property {string} messages.NOT_ACTIVE.
 * @property {string} messages.INSERT_SUCCESS.
 * @property {string} messages.UPDATE_SUCCESS.
 * @property {string} messages.DELETE_SUCCESS.
 * @property {string} messages.INSERT_ERROR.
 * @property {string} messages.UPDATE_ERROR.
 * @property {string} messages.DELETE_ERROR.
 * @property {string} messages.INVALID_LOGIN.
 * @property {string} messages.LOGGED_IN_SUCCESS.
 */
class MessageService {
  /**
   * @param  {string} entity Name of entity
   */
  constructor(entity) {
    const allMessages = {
      NOT_FOUND: `${entity} not found!`,
      NOT_ACTIVE: 'User status is not active',
      INSERT_SUCCESS: `${entity} added successfully`,
      UPDATE_SUCCESS: `${entity} updated successfully`,
      DELETE_SUCCESS: `${entity} deleted successfully`,
      INSERT_ERROR: `Error occurred while adding new ${entity.toLowerCase()}`,
      UPDATE_ERROR: `Error occurred while updating ${entity.toLowerCase()}`,
      DELETE_ERROR: `Error occurred while removing ${entity.toLowerCase()}`,
      INVALID_LOGIN: 'Invalid email or password!',
      LOGGED_IN_SUCCESS: 'User logged in successfully.',
      DETAILS_SUCCESS: `${entity} detail fetched successfully.`,
      LIST_SUCCESS: `${entity} list fetched successfully`,
      ERROR: 'some error occured!',
      INVALID_USER_ROLE: 'Invalid use role',
      STATUS_UPDATE_SUCCESS: `${entity} status updated successfully`,
      STATUS_NOT_UPDATE_SUCCESS: `Error occurred while updating status ${entity.toLowerCase()}`,
      INVALID_INPUT: 'Invalid Input',
      UNIQUE_IDENTIFIED:
        'Please provide valid unique identifier for language label!',
      CAP_UPDATE: 'Capability updated successfully',
      REPLY_SEND_SUCCESS: 'Reply send successfully',
      REPLY_SEND_ERROR: 'Error occurred while send Reply send.',
      IMAGE_DELETE: 'Image Deleted Successfully.',
      IMAGE_NOT_DELETE: 'Image Not Deleted Successfully.',
      DEFAULT_IMAGE_SET: 'Default image Set.',
    };
    const messages = {};
    Object.keys(allMessages).forEach(key => {
      messages[key] = allMessages[key];
    });
    return messages;
  }
}

export default MessageService;
