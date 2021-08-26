import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import User from './base-user.model';
import Enum from '../utils/enums';

const UserSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles',
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: Enum.LENGTH.User.Email,
  },
});

UserSchema.path('email').validate({
  isAsync: true,
  validator(value, respond) {
    const self = this;
    this.constructor.findOne(
      {
        email: value,
      },
      (err, user) => {
        if (err) {
          throw err;
        }
        if (user) {
          if (self.id === user.id) {
            respond(true);
          }
          respond(false);
        }
        respond(true);
      },
    );
  },
  message: 'The email you entered is already in our system.',
});

UserSchema.plugin(mongoosePaginate);

export default User.discriminator('admin', UserSchema);
