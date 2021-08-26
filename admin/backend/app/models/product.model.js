import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';

import metadataPlugin from '../utils/metadataPlugin';
import timestamps from '../utils/timestampPlugin';
// import mongoosePaginate from '../utils/mongoosePagerPlugin';
import Enum from '../utils/enums';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    maxlength: Enum.LENGTH.Maximum.Address,
    index: true,
  },
  shortDescription: {
    type: String,
    default: '',
  },
  longDescription: {
    type: String,
    default: '',
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'brand',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: Enum.LENGTH.Maximum.Name,
    lowercase: true,
  },
  images: [
    {
      name: {
        type: String,
        default: '',
      },
      sort_order: {
        type: Number,
        default: 0,
      },
      isDefault: {
        type: Boolean,
        default: 0,
      },
      url: {
        type: String,
        default: '',
      },
    },
  ],
  regularPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'In Active'],
    default: 'In Active',
  },
});

ProductSchema.path('slug').validate({
  isAsync: true,
  validator(value, respond) {
    const self = this;
    this.constructor.findOne(
      {
        url: value,
      },
      (err, entity) => {
        if (err) {
          throw err;
        }
        if (entity) {
          if (self.id === entity.id) {
            respond(true);
          }
          respond(false);
        }
        respond(true);
      },
    );
  },
  message: 'Product is already exists with given slug url.',
});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(timestamps, { index: true });
ProductSchema.plugin(metadataPlugin);

const Product = mongoose.model('product', ProductSchema);
export default Product;
