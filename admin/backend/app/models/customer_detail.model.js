import mongoose from 'mongoose';
const CustomerDetailSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
   age: {
    type: Number,
    default: '',
  },
   gender: {
    type: String,
    default: '',
  },
   age: {
    type: String,
    default: '',
  },
   id_proof: {
    type: String,
    default: '',
  },
   idnumber: {
    type: String,
    default: '',
  },
 customer_id: {
    type: Object,
  },
});

const CustomerDetail = mongoose.model('customer_detail', CustomerDetailSchema, 'ContactDetail');
export default CustomerDetail;
