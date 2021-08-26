import ValidationMessages from '../../../services/validation-messages';

class PageValidator {
  field;

  constructor() {
    this.field = {
      name: {
        in: ['body'],
        isLength: { options: { min: 1 } },
        errorMessage: ValidationMessages.getErrorMessage('Name', 'required'),
        trim: true,
        escape: true,
      },
      description: {
        in: ['body'],
        isLength: { options: { min: 1 } },
        errorMessage: ValidationMessages.getErrorMessage('description', 'required'),
        trim: true,
        escape: true,
      },
      'metadata.title': {
        in: ['body'],
        isLength: {
          errorMessage: ValidationMessages.getErrorMessage('Meta Tag Title', 'required'),
          options: { min: 1 },
        },
        trim: true,
        escape: true,
      },
      'metadata.description': {
        in: ['body'],
        isLength: {
          errorMessage: ValidationMessages.getErrorMessage('Meta Tag Description', 'required'),
          options: { min: 1 },
        },
        optional: { bodyfalsy: true },
        trim: true,
        escape: true,
      },
      'metadata.keyword': {
        in: ['body'],
        isLength: {
          errorMessage: ValidationMessages.getErrorMessage('Meta Tag Keyword', 'required'),
          options: { min: 1 },
        },
        optional: { bodyfalsy: true },
        trim: true,
        escape: true,
      },
      code: {
        in: ['body'],
        isLength: {
          errorMessage: ValidationMessages.getErrorMessage('Code', 'required'),
          options: { min: 1 },
        },
      },
      url: {
        in: ['body'],
        isLength: {
          errorMessage: ValidationMessages.getErrorMessage('url', 'required'),
          options: { min: 1 },
        },
        matches: {
          options: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          errorMessage: ValidationMessages.getErrorMessage('url', 'validUrl'),
        },
        trim: true,
        escape: true,
      },
      active: {
        in: ['body'],
        isIn: {
          options: [[true, false]],
          errorMessage: 'Invalid Value',
        },
        optional: { checkfalsy: true },
      },
    };
  }

  update = () => Object.assign({}, this.field, {
    id: {
      in: ['params'],
    },
  });
}

export default new PageValidator();
