import { containsUnitMeasurement } from "../DataStructures/unitMeasure";
import {
  findIngredientByName,
  isIngredientWord,
  isIngredientName,
} from "../DataStructures/ingredient";
import {
  wordsToNumbers,
  convertFractionsToDecimals,
  sanitizePunctuation,
  removeSpacesBeforePunctuation,
} from "../utilities/numberConversion";

import { findVolumeString } from "./volumeParsing";
import { MeasuredIngredient } from "../DataStructures/measuredIngredient";

export function parseIngredientList(ingredientListStringIn) {
  const lines = ingredientListStringIn.split("\n");
  var newLines = [];
  var measuredIngredients = [];
  for (const line of lines) {
    const [newLine, measuredIngredient] = parseIngredientListLine(line);
    newLines.push(newLine);
    if (measuredIngredient != null) {
      measuredIngredients.push(measuredIngredient);
    }
  }
  const finalString = newLines.join("\n");
  return [finalString, measuredIngredients];
}

/**
 * @param {string} lineIn
 */
export function parseIngredientListLine(lineIn) {
  //  ------- Pre Processing ------------ //
  var newLine = wordsToNumbers(lineIn);
  newLine = convertFractionsToDecimals(newLine);
  newLine = sanitizePunctuation(newLine);

  if (!containsUnitMeasurement(newLine)) {
    return [lineIn, null];
  }

  //  ------- Finding Volume Amount ------------ //

  const [volumeStringStartIndex, volumeInCups, volumeStringEndIndex] =
    findVolumeString(newLine);

  //  ------- Finding Ingredient Name  ------------ //

  const [ingredientName, ingredientEndIndex] = findIngredientName(
    newLine,
    volumeStringEndIndex
  );
  if (ingredientName == "") {
    return [lineIn, null];
  }
  const ingredient = findIngredientByName(ingredientName);

  //  ------- Conversion & String Building ------------ //

  const gramsAmount = ingredient.gramsPerCup * volumeInCups;
  const oldUnitMeasurement = newLine.substring(
    volumeStringStartIndex,
    volumeStringEndIndex
  );
  const prefix = newLine.substring(0, volumeStringStartIndex);
  const suffix = newLine.substring(volumeStringEndIndex);

  var finalString =
    prefix +
    gramsAmount.toFixed(1) +
    "g (" +
    oldUnitMeasurement +
    ") " +
    suffix;

  //  ------- Post Processing ------------ //
  finalString = removeSpacesBeforePunctuation(finalString);
  const finalIngredient = new MeasuredIngredient(
    ingredient,
    volumeInCups,
    oldUnitMeasurement
  );
  return [finalString, finalIngredient];
}

export function findIngredientName(lineIn, startIndex) {
  const words = lineIn
    .toLocaleLowerCase()
    .substring(startIndex + 1)
    .split(" ");

  var testString = "";
  var ingredientFound = "";
  for (
    var startWordIndex = 0;
    startWordIndex < words.length;
    startWordIndex++
  ) {
    const startWord = words[startWordIndex];
    testString = startWord;
    var word = startWord;
    var innerIndex = startWordIndex + 1;

    while (isIngredientWord(word)) {
      if (isIngredientName(testString)) {
        ingredientFound = testString;
      }
      if (innerIndex >= words.length) {
        break;
      }
      word = words[innerIndex++];
      testString += " " + word;
    }
    if (ingredientFound != "") {
      break;
    }
  }

  const testStringStartPosition = lineIn
    .toLocaleLowerCase()
    .indexOf(ingredientFound, startIndex);
  const testStringEndPosition =
    testStringStartPosition + ingredientFound.length;

  return [ingredientFound, testStringEndPosition];
}
