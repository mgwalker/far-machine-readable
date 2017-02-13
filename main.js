const getDOMfromURL = require('./get-dom-from-url');
const parsePartTOC = require('./parse-part-table-of-contents');

const baseURL = 'https://www.acquisition.gov';

getDOMfromURL(`${baseURL}/?q=browsefar`)
  .then(($) => {
    $('a.parts').each((index, a) => {
      getDOMfromURL(`${baseURL}${$(a).attr('href')}`).then(parsePartTOC);
    });
  });
