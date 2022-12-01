export const NEW_LINE_MARKER = "#$%^";

export function strInsert(baseString, insertionString, index) {
  return (
    baseString.substring(0, index) +
    insertionString +
    baseString.substring(index)
  );
}

function hasSuffix(string, suffix) {
  if (suffix.length > string.length) {
    return false;
  }
  return string.indexOf(suffix) == string.length - suffix.length;
}

export function roundDecimalNumber(number) {
  var result = number.toFixed(1);
  if (hasSuffix(result, ".0")) {
    return result.substring(0, result.length - 2);
  }
  return result;
}

export function strRemoveRange(baseString, startIndex, endIndex) {
  return baseString.substring(0, startIndex) + baseString.substring(endIndex);
}

export function isDecimal(character) {
  return "0123456789".indexOf(character) != -1;
}

const whitespaceChars = " \n\r\t";
function isWhitespace(character) {
  return stringContains(whitespaceChars, character);
}

export function removeAllWhitespace(string) {
  var result = string;
  for (const wChar of whitespaceChars) {
    result = result.replaceAll(wChar, "");
  }
  return result;
}

const punctuationChars = ".,/()!?";
function isPunctuation(character) {
  return stringContains(punctuationChars, character);
}

export function removeAllPunctuation(string) {
  var result = string;
  for (const wChar of punctuationChars) {
    result = result.replaceAll(wChar, "");
  }
  return result;
}

function isAlphabetic(character) {
  return !isPunctuation(character) && !isDecimal(character) && character != " ";
}

export function removeNulls(arr) {
  if (arr == undefined) {
    return undefined;
  }
  return arr.filter((value) => value != null);
}

export function removeTrailingWhitespace(string) {
  var lastIndex = string.length - 1;
  while (string.length > 0 && isWhitespace(string[lastIndex])) {
    lastIndex--;
  }
  return string.substring(0, lastIndex + 1);
}

export function removeLeadingWhiteSpace(string) {
  var lastIndex = 0;
  while (lastIndex < string.length && isWhitespace(string[lastIndex])) {
    lastIndex++;
  }
  return string.substring(lastIndex);
}

function isWordSeparator(character) {
  return isWhitespace(character) || isPunctuation(character);
}
export function strIndexOfWord(string, word, startIndex) {
  var index = string.indexOf(word, startIndex);
  while (index != -1 && index > 0 && !isWordSeparator(string[index - 1])) {
    index = string.indexOf(word, index + word.length);
  }
  return index;
}

export function debugString(string) {
  return string.replaceAll("\n", "\\n");
}

function newLineBeforeWord(recipeString, ingredientString, startIndex) {
  var index = startIndex;
  while (index >= 0 && isWhitespace(recipeString[index])) {
    if (recipeString[index] == "\n") {
      return true;
    }
    index--;
  }
  return false;
}
function removeSpacesBeforeWord(recipeString, ingredientString, startIndex) {
  var numSpaces = 0;
  const ingredientStart = recipeString.indexOf(ingredientString, startIndex);
  var index = ingredientStart - 1;
  while (index >= 0 && recipeString[index] == " ") {
    numSpaces++;
    index--;
  }
  const resultString = strRemoveRange(
    recipeString,
    ingredientStart - numSpaces,
    ingredientStart
  );
  const newIngredientStart = ingredientStart - numSpaces;
  return [resultString, newIngredientStart];
}

export function insertNewLinesAround(
  recipeString,
  ingredientString,
  startIndex
) {
  const lineStarter = " - ";
  var ingredientStart = strIndexOfWord(
    recipeString,
    ingredientString,
    startIndex
  );
  var newRecipe = recipeString;
  if (newLineBeforeWord(recipeString, ingredientString, startIndex)) {
    [newRecipe, ingredientStart] = removeSpacesBeforeWord(
      recipeString,
      ingredientString,
      startIndex
    );
  } else {
    const newLine = "\n" + NEW_LINE_MARKER;
    newRecipe = strInsert(newRecipe, newLine, ingredientStart);
    ingredientStart += newLine.length;
  }
  newRecipe = strInsert(newRecipe, lineStarter, ingredientStart);
  const ingredientEnd =
    newRecipe.indexOf(ingredientString, startIndex) + ingredientString.length;
  newRecipe = strInsert(newRecipe, "\n" + NEW_LINE_MARKER, ingredientEnd);
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
  var index = startIndex - 1;
  // Skip initial spaces
  while (index >= 0 && str[index] == " ") {
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
  return word.length == 0 || word == "and" || word == "," || word == "the";
}

export function isSimpleLine(lineIn) {
  const words = lineIn.split(" ");
  for (const word of words) {
    if (!isSimpleWord(word)) {
      return false;
    }
  }
  var line = lineIn;
  line = removeAllWhitespace(line);
  line = removeAllPunctuation(line);

  return true;
}

export function stringContains(haystack, needle) {
  return haystack.indexOf(needle) != -1;
}

export function stringContainsWord(haystack, needle) {
  const index = haystack.indexOf(needle);
  const endIndex = index + needle.length;
  return (
    index != -1 && (endIndex >= haystack.length || haystack[endIndex] == " ")
  );
}

function strRemoveAt(baseString, index) {
  return baseString.substring(0, index - 1) + baseString.substring(index);
}

export function sanitizePunctuation(strIn) {
  var str = strIn;
  for (var i = 0; i < str.length; i++) {
    if (i > 0 && isPunctuation(str[i]) && isAlphabetic(str[i - 1])) {
      str = strInsert(str, " ", i++);
    }
  }
  return str;
}

export function removeSpacesBeforePunctuation(strIn) {
  var str = strIn;
  const excludedPunctuation = "(";
  for (var i = 0; i < str.length; i++) {
    if (
      i > 0 &&
      isPunctuation(str[i]) &&
      str[i - 1] == " " &&
      !stringContains(excludedPunctuation, str[i])
    ) {
      str = strRemoveAt(str, i--);
    }
  }
  return str;
}
