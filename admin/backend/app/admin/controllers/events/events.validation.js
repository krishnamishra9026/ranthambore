import ValidationMessages from '../../../services/validation-messages';

class EventsValidator {
  field;

  constructor() {
    this.field = {
      zone: {
        in: ['body'],
        optional: { bodyFalsy: true },
        trim: true,
        escape: true,
      }, 
      date: {
        in: ['body'],
/*        isLength: {
          options: { min: 1 },
          errorMessage: ValidationMessages.getErrorMessage('date', 'required'),
        },*/
        trim: true,
        escape: true,
      },    
      vehicle: {
        in: ['body'],
        optional: { bodyFalsy: true },
         trim: true,
        escape: true,
      },
      availability: {
        in: ['body'],
        optional: { bodyFalsy: true },
        trim: true,
        escape: true,
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

export default new EventsValidator();
