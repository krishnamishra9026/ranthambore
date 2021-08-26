import ValidationMessages from '../../../services/validation-messages';

class CapabilityValidator {
  field;

  constructor() {
    this.field = {
      type: {
        in: ['body'],
        isIn: {
          options: [['custom', 'crud']],
          errorMessage: 'Invalid Value',
        },
      },
      name: {
        in: ['body'],
        optional: true,
        trim: true,
        escape: true,
      },
      module: {
        in: ['body'],
        isLength: {
          errorMessage: ValidationMessages.getErrorMessage('module', 'required'),
          options: { min: 1 },
        },
        trim: true,
        escape: true,
      },
    };
  }

  create = () => this.field;
}

export default new CapabilityValidator();
