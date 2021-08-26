import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { validator as expressValidator } from 'express-validator';


const BookingPriceSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  price: {
    type: Number,
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
});

BookingPriceSchema.plugin(mongoosePaginate);

const BookingPrices = mongoose.model('booking_prices', BookingPriceSchema);
export default BookingPrices;
