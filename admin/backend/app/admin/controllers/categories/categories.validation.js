import ValidationMessages from '../../../services/validation-messages';

class CategoriesValidator {
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
      description: {
        in: ['body'],
        optional: { bodyFalsy: true },
        trim: true,
        escape: true,
      },
      parent: {
        in: ['body'],
        optional: { bodyFalsy: true },
      },
      active: {
        in: ['body'],
        isBoolean: true,
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

export default new CategoriesValidator();
