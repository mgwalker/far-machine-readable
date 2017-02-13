const getNextParentheticalLabel = require('./get-next-parenthetical-label');

module.exports = function parseTextPieces(textPieces, previousIndentionLevel = 0) {
  if (textPieces.length) {
    if (textPieces[0].startsWith('(')) {
      const content = { };

      let lastIndentor = '';

      for (let i = 0; i < textPieces.length; i += 1) {
        const bits = textPieces[i].match(/\((.+?)\)(.+)/);
        if (!bits) {
          content[lastIndentor].text = `${content[lastIndentor].text}\n\n${textPieces[i]}`;
        } else {
          const indentor = bits[1].trim();
          const text = bits[2].trim();

          content[indentor] = { text };
          const nextExpectedIndentor = getNextParentheticalLabel(indentor, previousIndentionLevel);
          for (let j = i + 1; j < textPieces.length; j += 1) {
            const nextBits = textPieces[j].match(/^\((.+?)\)(.+)/);
            if (!nextBits) {
              content[indentor].text = `${content[indentor].text}\n\n${textPieces[j]}`;
            } else {
              const nextIndentor = nextBits[1].trim();

              if (nextIndentor === nextExpectedIndentor) {
                if (j > (i + 1)) {
                  content[indentor].sub = parseTextPieces(textPieces.slice(i + 1, j));
                  i = j - 1;
                }
                break;
              }
            }
          }

          lastIndentor = indentor;
        }
      }

      return content;
    }
    return { text: textPieces.join('\n\n') };
  }
  return { text: '' };
};
