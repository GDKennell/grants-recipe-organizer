export const NEW_LINE_MARKER = "#$%^";

export function strInsert(baseString, insertionString, index) {
  return (
    baseString.substring(0, index) +
    insertionString +
    baseString.substring(index)
  );
}

export function insertNewLinesAround(
  recipeString,
  ingredientString,
  startIndex
) {
  const lineStarter = " - ";
  const ingredientStart = recipeString.indexOf(ingredientString, startIndex);
  var newRecipe = strInsert(
    recipeString,
    "\n" + NEW_LINE_MARKER + lineStarter,
    ingredientStart
  );
  const ingredientEnd =
    ingredientStart +
    ingredientString.length +
    NEW_LINE_MARKER.length +
    lineStarter.length +
    1;
  newRecipe = strInsert(newRecipe, "\n" + NEW_LINE_MARKER, ingredientEnd);
  return [newRecipe, ingredientEnd];
}

function isWhitespace(character) {
  const whitespaceChars = " \n\r\t";
  return stringContains(whitespaceChars, character);
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
  return word.length == 0 || word == "and" || word == ",";
}

export function isSimpleLine(lineIn) {
  const words = lineIn.split(" ");
  for (const word of words) {
    if (!isSimpleWord(word)) {
      return false;
    }
  }
  return lineIn.length < 6;
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
