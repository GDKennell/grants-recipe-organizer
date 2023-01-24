import {isDecimal} from './stringHelpers';

const NumberStrings = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  thirteen: '13',
  fourteen: '14',
  fifteen: '15',
  sixteen: '16',
  seventeen: '17',
  eighteen: '18',
  nineteen: '19',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  sixty: '60',
  seventy: '70',
  eighty: '80',
  ninety: '90',
};

function wordToNumber(word) {
  const lowerWord = word.toLocaleLowerCase();
  if (!(lowerWord in NumberStrings)) {
    return word;
  }
  return NumberStrings[lowerWord];
}

export function wordsToNumbers(str) {
  const words = str.split(' ');
  return words.map(wordToNumber).join(' ');
}

function unicodeFractionsToRegularFractions(strIn) {
  let str = strIn;
  const unicodes = ['¼', '⅓', '½', '⅐', '⅔', '⅖', '¾', '⅙', '⅞', '⅒', '⅑'];
  let hasUnicode = false;
  for (const char of unicodes) {
    if (strIn.indexOf(char) != -1) {
      hasUnicode = true;
      break;
    }
  }
  if (!hasUnicode) {
    return strIn;
  }

  const unicodeToString = {};
  unicodes.forEach((char) => {
    const normalized = char.normalize('NFKD');
    const operands = normalized.split('⁄');
    const num = parseInt(operands[0]);
    const denom = parseInt(operands[1]);
    unicodeToString[char] = ' ' + num + '/' + denom;
  });
  for (const char of unicodes) {
    str = str.replace(char, unicodeToString[char]);
  }
  return str;
}

function isApproxEqual(left, right) {
  const precision = 0.001;
  return (right < left + precision &&
    right > left - precision);
}

function decimalToFraction(decimal) {
  const overrides = [[0.33, '1/3'], [0.66, '2/3'], [0.19, '3/16'], [0.06, '1/16'], [0.13, '1/8']];
  for (const overrideArr of overrides) {
    if (isApproxEqual(decimal, overrideArr[0])) {
      return overrideArr[1];
    }
  }

  const gcd = function(a, b) {
    if (b < 0.0001) return a; // Since there is a limited precision we need to limit the value.

    return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
  };

  const len = decimal.toString().length - 2;

  let denominator = Math.pow(10, len);
  let numerator = decimal * denominator;

  const divisor = gcd(numerator, denominator); // Should be 5

  numerator /= divisor; // Should be 687
  denominator /= divisor; // Should be 2000
  const allowedDenoms = [4, 3, 2, 8, 16];
  if (!allowedDenoms.includes(denominator)) {
    return null;
  }
  return `${numerator}/${denominator}`;
}

export function convertDecimalsToFractions(strIn) {
  const numberRegex = /[\d.]+/;
  const match = strIn.match(numberRegex);
  if (match == null ) {
    return strIn;
  }
  const numString = match[0];
  const number = parseFloat(numString);
  if (isNaN(number)) {
    return strIn;
  }
  let fullFractionString = '';
  if (number >= 1.0) {
    const fractionNum = number - Math.floor(number);
    const fractionString = decimalToFraction(fractionNum);
    if (fractionString) {
      fullFractionString = `${Math.floor(number)} ${fractionString}`;
    }
  } else {
    const fractionString = decimalToFraction(number);
    if (fractionString) {
      fullFractionString = `${fractionString}`;
    }
  }
  if (fullFractionString) {
    return strIn.replaceAll(numString, fullFractionString);
  }
  return strIn;
}

export function convertFractionsToDecimals(strIn) {
  const str = unicodeFractionsToRegularFractions(strIn);
  const slashIndex = str.indexOf('/');
  if (
    slashIndex == -1 ||
    slashIndex == 0 ||
    !isDecimal(str[slashIndex - 1]) ||
    slashIndex == str.length - 1 ||
    !isDecimal(str[slashIndex + 1])
  ) {
    return str;
  }
  let numeratorStartIndex = slashIndex - 1;
  while (numeratorStartIndex >= 0 && isDecimal(str[numeratorStartIndex])) {
    numeratorStartIndex--;
  }
  numeratorStartIndex++;

  let denomEndIndex = slashIndex + 1;
  while (denomEndIndex < str.length && isDecimal(str[denomEndIndex])) {
    denomEndIndex++;
  }

  const numString = str.substring(numeratorStartIndex, slashIndex);
  const denomString = str.substring(slashIndex + 1, denomEndIndex);
  let fraction = parseFloat(numString) / parseFloat(denomString);
  let wholeNumStart = numeratorStartIndex - 2;
  while (wholeNumStart >= 0 && isDecimal(str[wholeNumStart])) {
    wholeNumStart--;
  }
  if (wholeNumStart < numeratorStartIndex - 2) {
    const wholeNumStr = str.substring(wholeNumStart + 1, numeratorStartIndex);
    fraction += parseFloat(wholeNumStr);
    numeratorStartIndex = wholeNumStart + 1;
  }
  return (
    str.substring(0, numeratorStartIndex) +
    fraction.toFixed(2) +
    str.substring(denomEndIndex)
  );
}
