import ValidationMessages from '../../../services/validation-messages';

class ResourcesValidator {
  contactUs = () => {
    const fields = {
      name: {
        in: ['body'],
        isLength: {
          options: { min: 1 },
          errorMessage: ValidationMessages.getErrorMessage('name', 'required'),
        },
        trim: true,
        escape: true,
      },
      email: {
        in: ['body'],
        isLength: {
          errorMessage: ValidationMessages.getErrorMessage('email', 'required'),
          options: { min: 1 },
        },
        isEmail: {
          errorMessage: ValidationMessages.getErrorMessage('email', 'invalidEmail'),
        },
        trim: true,
        escape: true,
      },
      number: {
        in: ['body'],
        isLength: {
          options: { min: 1 },
          errorMessage: ValidationMessages.getErrorMessage('number', 'required'),
        },
        trim: true,
        escape: true,
      },
      message: {
        in: ['body'],
        isLength: {
          options: { min: 1 },
          errorMessage: ValidationMessages.getErrorMessage('message', 'required'),
        },
        trim: true,
        escape: true,
      },
    };

    return fields;
  };

  slug = () => ({
    slug: {
      in: ['params'],
      isLength: {
        options: { min: 1 },
        errorMessage: ValidationMessages.getErrorMessage('slug', 'required'),
      },
      trim: true,
      escape: true,
    },
  });

  keyword = () => ({
    keyword: {
      in: ['query'],
      optional: { checkFalsy: true },
      trim: true,
      escape: true,
    },
  });

  identifier = type => ({
    id: {
      in: [type || 'params'],
      isMongoId: {
        errorMessage: ValidationMessages.getErrorMessage('id', 'validIdentifier'),
      },
    },
  });

  category = () => ({
    category: {
      in: ['params'],
      optional: { checkFalsy: true },
      trim: true,
      escape: true,
    },
  });

  states = () => {
    const validation = Object.assign({}, this.identifier('params'), this.keyword());
    return validation;
  };

  cities = () => {
    const validation = Object.assign({}, this.identifier('params'), this.keyword());
    return validation;
  };
}

export default new ResourcesValidator();
