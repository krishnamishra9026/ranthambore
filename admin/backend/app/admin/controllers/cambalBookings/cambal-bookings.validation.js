import ValidationMessages from '../../../services/validation-messages';

class CustomersValidator {
  field;

  constructor() {
    this.field = {
      name: {
        in: ['body'],
        isLength: {
          options: { min: 1 },
          errorMessage: ValidationMessages.getErrorMessage('name', 'required'),
        },
        trim: true,
        escape: true,
      },
      mobile: {
        in: ['body'],
        optional: { bodyFalsy: true },
        trim: true,
        escape: true,
      },
      email: {
        in: ['body'],
        optional: { bodyFalsy: true },
      },
    };
  }

  create = () => this.field;

  update = () => Object.assign({}, this.field, {
    id: {
      in: ['params'],
    },
  });
}

export default new CustomersValidator();
