const request = require('request');
const cheerio = require('cheerio');

module.exports = function getDOMfromURL(url) {
  return new Promise((resolve, reject) => {
    request.get(url, { strictSSL: false }, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(cheerio.load(body));
      }
    });
  });
};
