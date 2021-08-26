import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
// import mongoosePaginate from '../utils/mongoosePagerPlugin';
import Enum from '../utils/enums';
import metadataPlugin from '../utils/metadataPlugin';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    maxlength: Enum.LENGTH.Maximum.Name,
    index: true,
    required: true,
  },
  description: {
    type: String,
    default: '',
    maxlength: Enum.LENGTH.Maximum.Description,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: undefined,
    ref: 'category',
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

CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(metadataPlugin);

const Category = mongoose.model('category', CategorySchema);
export default Category;
