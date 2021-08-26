import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import Enum from '../utils/enums';
import timestamps from '../utils/timestampPlugin';

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    default: '',
    maxlength: Enum.LENGTH.City.Name,
    index: true,
    required: true,
  },
  answer: {
    type: String,
    default: '',
    maxlength: Enum.LENGTH.City.Name,
    required: true,
    index: true,
  },
  seq_no: {
    type: Number,
    required: true,
    index: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});
FAQSchema.plugin(mongoosePaginate);
FAQSchema.plugin(timestamps, { index: true });
const City = mongoose.model('faqs', FAQSchema);
export default City;
