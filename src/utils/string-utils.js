export const BETWEEN_QUOTE_STRING = /^(["`])([\s\S]*)\1$/;

export function getStringContent(str = '') {
  let match = BETWEEN_QUOTE_STRING.exec(str);

  return match ? match[2] : str;
}

export function isStringBetweenQuotes(str = '') {
  return BETWEEN_QUOTE_STRING.test(str);
}

const htmlSpecialChars = /(['"&<>])/g;

const htmlScapedMap = {
  "'": '&#34;',
  '"': '&#39;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  //TODO: Sanitize NUL chars
};

export function escapeHTML(str) {
  return str.replaceAll(htmlSpecialChars, (match, char) => {
    if (match) {
      return htmlScapedMap[char] || '';
    }
    return '';
  });
}

const jsSpecialChars = /([\\'"&<>=]|\p{C})/gu;

const jsScapeMap = {
  '\\': '\\\\',
  "'": "\\'",
  '"': '\\"',
  '<': '\\u003C',
  '>': '\\u003E',
  '&': '\\u0026',
  '=': '\\u003D',
};

export function toUnicode(char, prefix = '\\u') {
  let unicodeValue = char.codePointAt(0).toString(16).toUpperCase();
  let presetLength = 4 - unicodeValue.length;

  if (presetLength) {
    unicodeValue = '0'.repeat(presetLength) + unicodeValue;
  }
  return prefix + unicodeValue;
}

export function escapeJS(str) {
  return str.replaceAll(jsSpecialChars, (match, char) => {
    if (match) {
      return jsScapeMap[char] || toUnicode(char);
    }
    return '';
  });
}
