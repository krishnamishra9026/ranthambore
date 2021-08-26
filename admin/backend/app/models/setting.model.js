import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import timestamps from '../utils/timestampPlugin';

const SettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Company', 'Appearance', 'Meta', 'Config', 'Social', 'SMS', 'Email'],
  },
  displayType: {
    type: String,
    required: true,
    enum: ['text', 'select', 'textarea', 'checkbox', 'hidden', 'password', 'editor', 'file'],
  },
  sourceValues: [
    {
      name: {
        type: String,
        required: true,
        default: '',
      },
      value: {
        type: String,
        required: true,
        default: '',
      },
    },
  ],
  validateCode: {
    type: String,
    required: false,
    default: '',
  },
  validateMessage: {
    type: String,
    required: false,
    default: '',
  },
  help: {
    type: String,
    required: false,
    default: '',
  },
  active: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

SettingSchema.path('name').validate({
  isAsync: true,
  validator(value, respond) {
    const current = this;
    this.constructor.findOne(
      {
        name: value,
      },
      (err, existing) => {
        if (err) {
          throw err;
        }
        if (existing) {
          if (current.id === existing.id) {
            respond(true);
          }
          respond(false);
        }
        respond(true);
      },
    );
  },
  message: 'Setting is already exists in system with given name.',
});

SettingSchema.plugin(timestamps, { index: true });
SettingSchema.plugin(mongoosePaginate);

const Setting = mongoose.model('setting', SettingSchema);
export default Setting;
