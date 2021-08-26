import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
//import mongoosePaginate from '../utils/mongoosePagerPlugin';
import Enum from '../utils/enums';
//import metadataPlugin from '../utils/metadataPlugin';

const EventSchema = new mongoose.Schema({
  date: {
    type: String,
    default: '',
    required: true,
  },
  zone: {
    type: String,
    default: '',
  },
  vehicle: {
    type: String,
    default: '',
  },
  timing: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    default: '',
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
  active: {
    type: Boolean,
    default: false,
  },
});

EventSchema.plugin(mongoosePaginate);
//EventSchema.plugin(metadataPlugin);

const Event = mongoose.model('event', EventSchema);
export default Event;
