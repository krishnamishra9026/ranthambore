import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import Enum from '../utils/enums';
import timestamps from '../utils/timestampPlugin';
import metadataPlugin from '../utils/metadataPlugin';

const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    // maxlength: Enum.LENGTH.Maximum.Name,
    index: true,
  },

  description: {
    type: String,
    default: '',
  },

  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: Enum.LENGTH.Maximum.Name,
    uppercase: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: Enum.LENGTH.Maximum.Name,
    lowercase: true,
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
    default: true,
  },
});

PageSchema.path('code').validate({
  isAsync: true,
  validator(value, respond) {
    const self = this;
    this.constructor.findOne(
      {
        code: value,
      },
      (err, entity) => {
        if (err) {
          throw err;
        }
        if (entity) {
          if (self.id === entity.id) {
            respond(true);
          }
          respond(false);
        }
        respond(true);
      },
    );
  },
  message: 'Page is already exists with given code.',
});

PageSchema.path('url').validate({
  isAsync: true,
  validator(value, respond) {
    const self = this;
    this.constructor.findOne(
      {
        url: value,
      },
      (err, entity) => {
        if (err) {
          throw err;
        }
        if (entity) {
          if (self.id === entity.id) {
            respond(true);
          }
          respond(false);
        }
        respond(true);
      },
    );
  },
  message: 'Page is already exists with given url.',
});

PageSchema.plugin(mongoosePaginate);
PageSchema.plugin(timestamps, { index: true });
PageSchema.plugin(metadataPlugin);

const Page = mongoose.model('page', PageSchema);

export default Page;
