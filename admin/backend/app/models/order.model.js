import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
   name: {
    type: String,
    default: '',
    index: true,
    required: true,
  },
  address: {
    type: String,
    default: '',
    index: true,
    required: true,
  },
    email: {
    type: String,
    default: '',
    index: true,
    required: true,
  }, 
  mobile: {
    type: Number,
    default: '',
  },
  date: {
    type: Number,
    required: false,
  },
   date_added: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    default: false,
  },
  zone: {
    type: String,
    default: false,
  },
  vehicle: {
    type: String,
    default: false,
  },
   transaction_id: {
    type: Number,
    default: '',
  },
  customer_id: {
    type: Object,
  },
});
const Order = mongoose.model('order', OrderSchema ,  'Order');
export default Order;
