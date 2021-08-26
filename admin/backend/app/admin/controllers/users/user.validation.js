import ValidationMessages from '../../../services/validation-messages';

class UserValidator {
  field;

  constructor() {
    this.field = {
      firstName: {
        in: ['body'],
        isLength: { options: { min: 1 } },
        errorMessage: ValidationMessages.getErrorMessage('firstName', 'required'),
        trim: true,
        escape: true,
      },
      lastName: {
        in: ['body'],
        isLength: { options: { min: 1 } },
        errorMessage: ValidationMessages.getErrorMessage('lastName', 'required'),
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
      mobile: {
        in: ['body'],
        optional: { checkFalsy: true },
        errorMessage: ValidationMessages.getErrorMessage('mobile', 'required'),
        trim: true,
        escape: true,
      },
      status: {
        isIn: {
          options: [['Active', 'In Active', 'Delete', 'Pending']],
          errorMessage: 'Invalid Value',
        },
        optional: { bodyFalsy: true },
      },
      passwordHash: {
        in: ['body'],
        optional: { bodyFalsy: true },
      },
      'company.name': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.businessType': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.email': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.fax': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.address.street': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.address.landmark': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.address.country': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.address.state': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.address.city': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
      },
      'company.address.postcode': {
        in: ['body'],
        optional: { checkFalsy: true },
        trim: true,
        escape: true,
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

export default new UserValidator();
