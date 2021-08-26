import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { validator as expressValidator } from 'express-validator';


const ChambalPriceSchema = new mongoose.Schema({
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

ChambalPriceSchema.plugin(mongoosePaginate);

const ChambalPrices = mongoose.model('chambal_prices', ChambalPriceSchema);
export default ChambalPrices;
