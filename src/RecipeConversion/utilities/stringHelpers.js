export const NEW_LINE_MARKER = '#$%^';

export function strInsert(baseString, insertionString, index) {
  return (
    baseString.substring(0, index) +
    insertionString +
    baseString.substring(index)
  );
}

export function objectsEqual(o1, o2) {
  return typeof o1 === 'object' &&
  Object.keys(o1).length > 0 ?
        Object.keys(o1).length === Object.keys(o2).length &&
            Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p])) :
        o1 === o2;
}


// function objectArraysEqual(a1, a2) {
//   if ( a1.length != a2.length ) {
//     return false;
//   }
//   for (let i = 0; i < a1.length; i++) {
//     if (!objectsEqual(a1[i], a2[i])) {
//       return false;
//     }
//   }
//   return true;
// }

function hasSuffix(string, suffix) {
  if (suffix.length > string.length) {
    return false;
  }
  return string.indexOf(suffix) == string.length - suffix.length;
}

export function removeExtraNewLines(string) {
  return string.replaceAll('\n\n', '\n');
}

export function roundDecimalNumber(number) {
  const result = number.toFixed(1);
  if (hasSuffix(result, '.0')) {
    return result.substring(0, result.length - 2);
  }
  return result;
}

export function strRemoveRange(baseString, startIndex, endIndex) {
  return baseString.substring(0, startIndex) + baseString.substring(endIndex);
}

export function isDecimal(character) {
  return '0123456789'.indexOf(character) != -1;
}

export function isValidNumberString(string) {
  let numPeriods = 0;
  for (const char of string) {
    if (isDecimal(char)) {
      continue;
    }
    if (char == '.' && numPeriods == 0) {
      numPeriods++;
      continue;
    }
    return false;
  };
  return true;
}

const whitespaceChars = ' \n\r\t';
function isWhitespace(character) {
  return stringContains(whitespaceChars, character);
}

export function removeAllWhitespace(string) {
  let result = string;
  for (const wChar of whitespaceChars) {
    result = result.replaceAll(wChar, '');
  }
  return result;
}

const punctuationChars = '.,/()!?';
function isPunctuation(character) {
  return stringContains(punctuationChars, character);
}

export function removeAllPunctuation(string) {
  let result = string;
  for (const wChar of punctuationChars) {
    result = result.replaceAll(wChar, '');
  }
  return result;
}

function isAlphabetic(character) {
  return !isPunctuation(character) && !isDecimal(character) && character != ' ';
}

export function removeNulls(arr) {
  if (arr == undefined) {
    return undefined;
  }
  return arr.filter((value) => value != null);
}

export function removeTrailingWhitespace(string) {
  let lastIndex = string.length - 1;
  while (string.length > 0 && isWhitespace(string[lastIndex])) {
    lastIndex--;
  }
  return string.substring(0, lastIndex + 1);
}

export function removeLeadingWhiteSpace(string) {
  let lastIndex = 0;
  while (lastIndex < string.length && isWhitespace(string[lastIndex])) {
    lastIndex++;
  }
  return string.substring(lastIndex);
}

export function cleanIngredientWord(string) {
  return removeLeadingWhiteSpace(removeTrailingWhitespace(string));
}

function isWordSeparator(character) {
  return isWhitespace(character) || isPunctuation(character);
}
export function strIndexOfWord(string, word, startIndex) {
  let index = string.indexOf(word, startIndex);
  while (index != -1 && index > 0 && !isWordSeparator(string[index - 1])) {
    index = string.indexOf(word, index + word.length);
  }
  return index;
}

export function debugString(string) {
  return string.replaceAll('\n', '\\n');
}

function newLineBeforeWord(recipeString, ingredientString, startIndex) {
  let index = startIndex;
  while (index >= 0 && isWhitespace(recipeString[index])) {
    if (recipeString[index] == '\n') {
      return true;
    }
    index--;
  }
  return false;
}
function removeSpacesBeforeWord(recipeString, ingredientString, startIndex) {
  let numSpaces = 0;
  const ingredientStart = recipeString.indexOf(ingredientString, startIndex);
  let index = ingredientStart - 1;
  while (index >= 0 && recipeString[index] == ' ') {
    numSpaces++;
    index--;
  }
  const resultString = strRemoveRange(
      recipeString,
      ingredientStart - numSpaces,
      ingredientStart,
  );
  const newIngredientStart = ingredientStart - numSpaces;
  return [resultString, newIngredientStart];
}

export function insertNewLinesAround(
    recipeString,
    ingredientString,
    startIndex,
) {
  const lineStarter = ' - ';
  let ingredientStart = strIndexOfWord(
      recipeString,
      ingredientString,
      startIndex,
  );
  let newRecipe = recipeString;
  if (newLineBeforeWord(recipeString, ingredientString, startIndex)) {
    [newRecipe, ingredientStart] = removeSpacesBeforeWord(
        recipeString,
        ingredientString,
        startIndex,
    );
  } else {
    const newLine = '\n' + NEW_LINE_MARKER;
    newRecipe = strInsert(newRecipe, newLine, ingredientStart);
    ingredientStart += newLine.length;
  }
  newRecipe = strInsert(newRecipe, lineStarter, ingredientStart);
  const ingredientEnd =
    newRecipe.indexOf(ingredientString, startIndex) + ingredientString.length;
  newRecipe = strInsert(newRecipe, '\n' + NEW_LINE_MARKER, ingredientEnd);
  return [newRecipe, ingredientEnd];
}

export function isLineAllWhitespace(line) {
  for (const char of line) {
    if (!isWhitespace(char)) {
      return false;
    }
  }
  return true;
}

export function wordBefore(str, startIndex) {
  let index = startIndex - 1;
  // Skip initial spaces
  while (index >= 0 && str[index] == ' ') {
    index--;
  }
  const wordEnd = index + 1;
  // Go until next whitespace / start of string
  while (index >= 0 && !isWhitespace(str[index])) {
    index--;
  }
  const wordStart = index + 1;
  const word = str.substring(wordStart, wordEnd);
  return [word, wordStart];
}

function isSimpleWord(word) {
  return word.length == 0 || word == 'and' || word == ',' || word == 'the';
}

export function isSimpleLine(lineIn) {
  const words = lineIn.split(' ');
  for (const word of words) {
    if (!isSimpleWord(word)) {
      return false;
    }
  }
  return true;
}

export function stringContains(haystack, needle) {
  return haystack.indexOf(needle) != -1;
}

export function stringContainsWord(haystack, needle) {
  const index = haystack.indexOf(needle);
  const endIndex = index + needle.length;
  return (
    index != -1 && (endIndex >= haystack.length || haystack[endIndex] == ' ')
  );
}

function strRemoveAt(baseString, index) {
  return baseString.substring(0, index - 1) + baseString.substring(index);
}

export function sanitizePunctuation(strIn) {
  let str = strIn;
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && isPunctuation(str[i]) && isAlphabetic(str[i - 1])) {
      str = strInsert(str, ' ', i++);
    }
  }
  return str;
}

export function sanitizeIngredientName(strIn) {
  let str = strIn;
  str = removeTrailingWhitespace(str);
  str = removeLeadingWhiteSpace(str);
  str = str.toLocaleLowerCase();
  return str;
}

export function removeSpacesBeforePunctuation(strIn) {
  let str = strIn;
  const excludedPunctuation = '(';
  for (let i = 0; i < str.length; i++) {
    if (
      i > 0 &&
      isPunctuation(str[i]) &&
      str[i - 1] == ' ' &&
      !stringContains(excludedPunctuation, str[i])
    ) {
      str = strRemoveAt(str, i--);
    }
  }
  return str;
}
