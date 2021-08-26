/* eslint no-console: ["off"] */

import records from './data/system_emails.json';

import SystemEmail from '../models/systemEmails.model';

function runs() {
  return SystemEmail.deleteMany({})
    .then(() => {
      console.log('System data cleared successfully!');

      return SystemEmail.create(records).then(() => {
        console.log('System data insert successfully!');
      });
    })
    .catch(() => {
      console.log('Error ocurred while running system email!');
    });
}
module.exports = runs;
