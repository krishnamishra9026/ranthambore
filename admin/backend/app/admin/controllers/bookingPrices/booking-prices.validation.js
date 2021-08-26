import ValidationMessages from '../../../services/validation-messages';

class BookingPricesValidator {
  field;

  constructor() {
    this.field = {
      name: {
        in: ['body'],
        trim: true,
        escape: true,
      },     
      price: {
        in: ['body'],
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

export default new BookingPricesValidator();
