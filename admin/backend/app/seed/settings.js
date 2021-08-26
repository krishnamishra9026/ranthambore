/* eslint no-console: ["off"], consistent-return: ["off"], max-len: ["off"] */

import Setting from '../models/setting.model';

const settings = require('./data/settings.json');

function runs() {
  return Setting.deleteMany()
    .then(() => {
      console.log('Settings data cleared successfully!');
      return Setting.create(settings)
        .then(() => {
          console.log('Settings seed completed successfully!');
          return true;
        })
        .catch(() => console.log('Error ocurred while creating settings from seed!'));
    })
    .catch(() => {
      console.log('Error ocurred while removing settings!');
    });
}

module.exports = runs;
