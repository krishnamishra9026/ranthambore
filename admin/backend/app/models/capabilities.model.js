import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import Enum from '../utils/enums';
import timestamps from '../utils/timestampPlugin';

const CapabilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    maxlength: Enum.LENGTH.Capability.Name,
  },
  slug: {
    type: String,
    required: true,
    maxlength: Enum.LENGTH.Capability.Slug,
    unique: true,
    lowercase: true,
  },
  module: {
    type: String,
    index: true,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

CapabilitySchema.path('slug').validate({
  isAsync: true,
  validator(value, respond) {
    const self = this;
    this.constructor.findOne(
      {
        slug: value,
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
  message: 'Capability already exists with given name.',
});

CapabilitySchema.plugin(timestamps, { index: true });
CapabilitySchema.plugin(mongoosePaginate);

const Capabilities = mongoose.model('capabilities', CapabilitySchema);
export default Capabilities;
