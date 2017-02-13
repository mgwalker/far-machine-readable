const url = require('url');
const getDOMfromURL = require('./get-dom-from-url');
const parseSubpart = require('./parse-subpart');

const subpartsPath = 'https://www.acquisition.gov/sites/default/files/current/far/html/';

module.exports = function parsePartTableOfContents($) {
  const subparts = $('a[href]:not([accesskey])');

  // Build up a unique list of URL sub paths. The table of contents
  // will link to the same path multiple times with different
  // hash targets. We're just going to parse the page all at once,
  // so we only want the unique paths.
  const paths = new Set();
  subparts.each((i, sub) => {
    paths.add(url.parse($(sub).attr('href')).path);
  });

  // Go get the pages and parse them.
  for (const path of paths.values()) {
    getDOMfromURL(`${subpartsPath}${path}`).then(parseSubpart);
  }
};
