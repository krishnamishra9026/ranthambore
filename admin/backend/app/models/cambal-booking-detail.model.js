import mongoose from 'mongoose';
const CambalBookingDetailSchema = new mongoose.Schema({
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
  type: String,
  default: '',
},
date: {
  type: String,
  required: false,
},

time: {
  type: String,
  required: false,
},
date_added: {
  type: String,
  required: false,
},
amount: {
  type: String,
  default: false,
},
transaction_id: {
  type: String,
  default: '',
},
booking_name: {
  type: String,
  default: '',
},

id_proof_no: {
  type: String,
  default: '',
},

no_of_persons_indian: {
  type: Number,
  default: '',
},

no_of_persons_foreigner: {
  type: Number,
  default: '',
},

booking_option: {
  type: String,
  default: '',
},

id: {
  type: Number,
  default: '',
},

active: {
    type: Boolean,
    default: false,
  },
});

const CambalBookingDetail = mongoose.model('CambalBooking', CambalBookingDetailSchema, 'cambalBooking');
export default CambalBookingDetail;
