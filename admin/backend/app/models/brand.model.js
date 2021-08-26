import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import metadataPlugin from '../utils/metadataPlugin';
import Enum from '../utils/enums';

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    maxlength: Enum.LENGTH.Maximum.Name,
    index: true,
    required: true,
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
    },
  ],
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
  active: {
    type: Boolean,
    default: false,
  },
});

BrandSchema.plugin(mongoosePaginate);
BrandSchema.plugin(metadataPlugin);

const Brand = mongoose.model('brand', BrandSchema);
export default Brand;
