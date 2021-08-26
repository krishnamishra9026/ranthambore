import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import Enum from '../utils/enums';
import timestamps from '../utils/timestampPlugin';

const RolesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    maxlength: Enum.LENGTH.Roles.Name,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: Enum.LENGTH.Roles.Slug,
  },
  capabilityHash: {
    type: String,
    default: '',
  },
  capabilities: {
    type: Array,
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

RolesSchema.path('slug').validate({
  isAsync: true,
  validator(value, respond) {
    const self = this;
    this.constructor.findOne(
      {
        slug: value,
      },
      (err, role) => {
        if (err) {
          throw err;
        }
        if (role) {
          if (self.id === role.id) {
            respond(true);
          }
          respond(false);
        }
        respond(true);
      },
    );
  },
  message: 'Role is already in our system with given name.',
});

RolesSchema.plugin(mongoosePaginate);
RolesSchema.plugin(timestamps, { index: true });

const Roles = mongoose.model('roles', RolesSchema);
export default Roles;
