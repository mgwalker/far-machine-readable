const roman = require('roman-numerals');

function stringReplaceAtIndex(string, index, replacement) {
  return `${string.substr(0, index)}${replacement}${string.substr(index + 1)}`;
}

function incrementCharacterAt(string, index) {
  return stringReplaceAtIndex(string, index, String.fromCharCode(string.charCodeAt(index) + 1));
}

module.exports = function getNextParentheticalLabel(indentor, previousIndentionLevel) {
  switch (previousIndentionLevel) {
    case 0:
    case 3:
      {
        let newIndentor = indentor.toLowerCase();
        const lastIndex = newIndentor.length - 1;
        newIndentor = incrementCharacterAt(newIndentor, lastIndex);

        for (let i = lastIndex; i >= 0; i -= 1) {
          const rotate = newIndentor.charCodeAt(i);
          if (rotate > 122) { // 'z'
            newIndentor = stringReplaceAtIndex(newIndentor, i, 'a');
            if (i > 0) {
              newIndentor = incrementCharacterAt(newIndentor, i - 1);
            } else {
              newIndentor = `a${newIndentor}`;
            }
          }
        }

        return previousIndentionLevel === 0 ? newIndentor : newIndentor.toUpperCase();
      }

    case 1:
    case 4:
      return String(Number(indentor) + 1);

    case 2:
    case 5:
      return roman.toRoman(roman.toArabic(indentor.toUpperCase()) + 1).toLowerCase();

    default:
      return '';
  }
};
