import ValidationMessages from '../../../services/validation-messages';

class FaqValidator {
	field;

	constructor() {
	  this.field = {
	    question: {
	      in: ['body'],
	      isLength: {
	        options: {
	          min: 1,
	        },
	        errorMessage: ValidationMessages.getErrorMessage('question', 'required'),
	      },
	      trim: true,
	      escape: true,
	    },
	    answer: {
	      in: ['body'],
	      isLength: {
	        options: {
	          min: 1,
	        },
	        errorMessage: ValidationMessages.getErrorMessage('answer', 'required'),
	      },
	      trim: true,
	      escape: true,
	    },
	    seq_no: {
	      in: ['body'],
	      isLength: {
	        options: {
	          min: 1,
	        },
	        errorMessage: ValidationMessages.getErrorMessage('seq_no', 'required'),
	      },
	      trim: true,
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

export default new FaqValidator();
