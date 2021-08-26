import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const LogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: '',
    },
    method: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    remoteUser: {
      type: String,
      default: '',
    },
    remoteAddress: {
      type: String,
      default: '',
    },
    httpVersion: {
      type: String,
      default: '',
    },
    responseTime: {
      type: String,
      default: '',
    },
    referrer: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    capped: {
      size: 4 * 1024 * 1024, // 4 MB
      max: 50000,
    },
  },
);
LogSchema.plugin(mongoosePaginate);
const Logs = mongoose.model('log', LogSchema);
export default Logs;
