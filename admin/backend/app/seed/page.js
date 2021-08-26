/* eslint no-console: ["off"], consistent-return: ["off"], max-len: ["off"] */

import Page from '../models/page.model';

const page = require('./data/page.json');

function runs() {
  return Page.deleteMany({})
    .then(() => {
      console.log('Page data cleared successfully!');
      return Page.create(page)
        .then(() => {
          console.log('Page seed completed successfully!');
          return true;
        })
        .catch(() => console.log('Error ocurred while creating page from seed!'));
    })
    .catch(() => {
      console.log('Error ocurred while removing page!');
    });
}

module.exports = runs;
