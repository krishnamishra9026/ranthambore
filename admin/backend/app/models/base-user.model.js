import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import timestamps from '../utils/timestampPlugin';
import Enum from '../utils/enums';

const BaseUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: Enum.LENGTH.User.FirstName,
      default: '',
      index: true,
    },
    lastName: {
      type: String,
      required: false,
      maxlength: Enum.LENGTH.User.LastName,
      default: '',
      index: true,
    },
    mobile: {
      type: String,
      default: '',
      maxlength: Enum.LENGTH.User.Mobile.Max,
    },
    lastlogin: {
      type: Date,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    profile_pic: [
      {
        type: String,
        default: [],
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    resetVerificationCode: {
      type: String,
      default: '',
    },
    resetTokenExpires: {
      type: Date,
    },
    passwordHash: {
      type: String,
      select: false,
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
    status: {
      type: String,
      enum: ['Pending', 'Active', 'In Active'],
      default: 'Pending',
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    discriminatorKey: 'role',
  },
);

/**
 * Virtuals
 */

BaseUserSchema.virtual('password')
  .set(function(password) {
    this.upassword = password;
    this.passwordHash = this.getPasswordHash(password);
  })
  .get(function() {
    return this.upassword;
  });

/**
 * Methods
 */

BaseUserSchema.methods = {
  /**
	 * Authenticate
	 *
	 * @param {String} password
	 * @return {Boolean}
	 */
  authenticate(password, hash) {
    return bcrypt.compareSync(password, hash);
  },
  getPasswordHash(password) {
    return bcrypt.hashSync(password, 10);
  },
};

BaseUserSchema.plugin(timestamps, { index: true });

const BaseUser = mongoose.model('user', BaseUserSchema);

export default BaseUser;
