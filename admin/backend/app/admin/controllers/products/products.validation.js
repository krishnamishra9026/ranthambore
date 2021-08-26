import ValidationMessages from '../../../services/validation-messages';

class PriductsValidator {
	field;

	constructor() {
	  this.field = {
	    name: {
	      in: ['body'],
	      isLength: { options: { min: 1 } },
	      errorMessage: ValidationMessages.getErrorMessage('name', 'required'),
	      trim: true,
	      escape: true,
	    },
	    shortDescription: {
	      in: ['body'],
	      isLength: { options: { min: 1 } },
	      errorMessage: ValidationMessages.getErrorMessage('shortDescription', 'required'),
	      trim: true,
	      escape: true,
	    },
	    brand: {
	      in: ['body'],
	      isLength: {
	        errorMessage: ValidationMessages.getErrorMessage('brand', 'required'),
	        options: { min: 1 },
	      },
	      isMongoId: {
	        errorMessage: ValidationMessages.getErrorMessage('brand', 'validIdentifier'),
	      },
	    },
	    category: {
	      in: ['body'],
	      isLength: {
	        errorMessage: ValidationMessages.getErrorMessage('category', 'required'),
	        options: { min: 1 },
	      },
	      isMongoId: {
	        errorMessage: ValidationMessages.getErrorMessage('category', 'validIdentifier'),
	      },
	    },
	    subCategory: {
	      in: ['body'],
	      isLength: {
	        errorMessage: ValidationMessages.getErrorMessage('subCategory', 'required'),
	        options: { min: 1 },
	      },
	      isMongoId: {
	        errorMessage: ValidationMessages.getErrorMessage('subCategory', 'validIdentifier'),
	      },
	    },
	    regularPrice: {
	      in: ['body'],
	      isLength: {
	        errorMessage: ValidationMessages.getErrorMessage('regularPrice', 'required'),
	        options: { min: 1 },
	      },
	      isDecimal: {
	        errorMessage: ValidationMessages.getErrorMessage('regularPrice', 'numberOnly'),
	      },
	    },
	    discountedPrice: {
	      in: ['body'],
	      isLength: {
	        errorMessage: ValidationMessages.getErrorMessage('discountedPrice', 'required'),
	        options: { min: 1 },
	      },
	      isDecimal: {
	        errorMessage: ValidationMessages.getErrorMessage('discountedPrice', 'numberOnly'),
	      },
	    },
	    status: {
	      isIn: {
	        options: [['Active', 'In Active', 'Delete', 'Pending']],
	        errorMessage: 'Invalid Value',
	      },
	      optional: { bodyFalsy: true },
	    },
	    metadata: {
	      in: ['body'],
	      optional: { bodyfalsy: true },
	    },
	    imagesRemove: {
	      in: ['body'],
	      optional: { bodyfalsy: true },
	    },
	  };
	}

	create = () => this.field;

	update = () => Object.assign({}, this.field, {
	    id: {
	      in: ['params'],
	      isMongoId: {
	        errorMessage: ValidationMessages.getErrorMessage('id', 'validIdentifier'),
	      },
	    },
	  });
}

export default new PriductsValidator();
