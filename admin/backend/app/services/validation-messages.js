class ValidationMessages {
  messages;

  constructor() {
    this.messages = {
      invalidEmail: 'Please enter valid email address.',
      required: '{field} is required',
      numberOnly: 'Please enter number only',
      validIdentifier: 'Please provide valid identifier for this field',
      validUrl: 'Please provide valid url for the field',
    };
  }

  getErrorMessage = (field, error) => {
    const message = this.messages[error].replace('{field}', field);
    return message;
  };
}

export default new ValidationMessages();
