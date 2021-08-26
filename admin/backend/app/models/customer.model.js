import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
// import mongoosePaginate from '../utils/mongoosePagerPlugin';
import Enum from '../utils/enums';
// import metadataPlugin from '../utils/metadataPlugin';



const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    index: true,
  },
  address: {
    type: String,
    default: '',
    index: true,
  },
    email: {
    type: String,
    default: '',
    index: true,
  },
    mobile: {
    type: String,
    default: '',
    index: true,
  },

   date_ordered: {
    type: String,
    default: '',
    index: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  /*orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders',
    required: true,
    index: true,
  },*/
/*   ContactDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'contact',
    required: true,
    index: true,
  },*/
/*  description: {
    type: String,
    default: '',
    maxlength: Enum.LENGTH.Maximum.Description,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: undefined,
    ref: 'category',
  },*/
/*  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },*/
/*  deleted: {
    type: Boolean,
    default: false,
  },*/
/*  active: {
    type: Boolean,
    default: false,
  },*/
});

// const CustomerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     default: '',
//     maxlength: Enum.LENGTH.Maximum.Name,
//     index: true,
//     required: true,
//   },
//   mobile: {
//     type: String,
//     default: '',
//     maxlength: Enum.LENGTH.Maximum.Mobile,
//   },
//   email: {
//     type: String,
//     default: '',
//   },
//   address: {
//     type: String,
//     default: '',
//     minlength: 10,
//   },
// });

CustomerSchema.plugin(mongoosePaginate);
// CustomerSchema.plugin(metadataPlugin);

const Customer = mongoose.model('customer', CustomerSchema, 'Customer');
export default Customer;
