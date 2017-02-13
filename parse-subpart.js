const fs = require('fs');
const parseTextPieces = require('./parse-text-pieces');

module.exports = function parseSubpart($) {
  const subpartInfo = $('h2.pSubpart').text().match(/Subpart (\d+)\.(\d+)—(.+)/);

  const subpart = {
    parentPart: Number(subpartInfo[1]),
    number: Number(subpartInfo[2]),
    name: subpartInfo[3].trim(),
    sub: { }
  };

  // The H3 elements mark each section of the subpart
  $('h3.pSection').each((i, section) => {
    const sectionInfo = $(section).text().match(/(\d+)\.(\d+)(-(\d)+)?\s+(.*)/);
    const sectionNumber = Number(sectionInfo[2]);

    const content = [];
    let next = $(section).next();
    while (next[0] && !next[0].name.startsWith('h')) {
      // [TODO] Need to handle content elements other than
      // just <p>, like <table> etc.

      if (next[0].name === 'p') {
        content.push(next.text().trim());
      }
      next = next.next();
    }

    if (sectionInfo[4]) {
      subpart.sub[sectionNumber].sub[sectionInfo[4]] = {
        name: sectionInfo[5],
        text: parseTextPieces(content)
      };
    } else {
      subpart.sub[sectionNumber] = {
        name: sectionInfo[5],
        text: parseTextPieces(content),
        sub: { }
      };
    }
  });
  fs.writeFile(`./far-json/part-${subpart.parentPart}-subpart-${subpart.number}.json`, JSON.stringify(subpart, false, '  '));
};
