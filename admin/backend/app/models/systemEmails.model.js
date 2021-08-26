import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { validator as expressValidator } from 'express-validator';

import Enum from '../utils/enums';
import timestamps from '../utils/timestampPlugin';

const SystemEmailSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: Enum.LENGTH.Email.Title,
    index: true,
  },
  code: {
    type: String,
    required: true,
    maxlength: Enum.LENGTH.Email.Code,
    index: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
    maxlength: Enum.LENGTH.Email.Subject,
  },
  fromName: {
    type: String,
    required: true,
    maxlength: Enum.LENGTH.Email.Title,
  },
  fromEmail: {
    type: String,
    required: true,
    maxlength: Enum.LENGTH.Email.Title,
  },
  bcc: {
    type: String,
    maxlength: Enum.LENGTH.Email.Bcc,
  },
  cc: {
    type: String,
    maxlength: Enum.LENGTH.Email.Cc,
  },
  variables: [
    {
      _id: false,
      name: {
        type: String,
        maxlength: Enum.LENGTH.Email.variables,
      },
      description: {
        type: String,
        maxlength: Enum.LENGTH.Email.Description,
      },
    },
  ],
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
  message: {
    type: String,
    required: true,
  },
});
SystemEmailSchema.path('code').validate({
  isAsync: true,
  validator(value, respond) {
    const self = this;
    this.constructor.findOne(
      {
        code: value,
        deleted: false,
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
  message: 'The code you entered is already in our system.',
});
SystemEmailSchema.path('code').get(item => expressValidator.unescape(item));

SystemEmailSchema.plugin(timestamps, { index: true });
SystemEmailSchema.plugin(mongoosePaginate);

const SystemEmails = mongoose.model('system_emails', SystemEmailSchema);
export default SystemEmails;
