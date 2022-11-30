import { containsVolumeMeasurement } from "../DataStructures/volumeMeasures";
import {
  findIngredientByName,
  isIngredientWord,
  isIngredientName,
} from "../DataStructures/ingredient";
import { removeNulls } from "../utilities/stringHelpers";
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

  if (!containsVolumeMeasurement(newLine)) {
    return [lineIn, null];
  }

  //  ------- Finding Volume Amount ------------ //

  const [volumeStringStartIndex, volumeInCups, volumeStringEndIndex] =
    findVolumeString(newLine);

  //  ------- Finding Ingredient Name  ------------ //

  const ingredientName = findIngredientName(newLine, volumeStringEndIndex);
  if (ingredientName == "") {
    return [lineIn, null];
  }
  const ingredient = findIngredientByName(ingredientName);

  //  ------- Conversion & String Building ------------ //

  const gramsAmount = ingredient.gramsPerCup * volumeInCups;
  const oldVolumeMeasurement = newLine.substring(
    volumeStringStartIndex,
    volumeStringEndIndex
  );
  const prefix = newLine.substring(0, volumeStringStartIndex);
  const suffix = newLine.substring(volumeStringEndIndex);

  var finalString =
    prefix +
    gramsAmount.toFixed(1) +
    "g (" +
    oldVolumeMeasurement +
    ") " +
    suffix;

  //  ------- Post Processing ------------ //
  finalString = removeSpacesBeforePunctuation(finalString);
  const finalIngredient = new MeasuredIngredient(
    ingredient,
    volumeInCups,
    oldVolumeMeasurement
  );
  return [finalString, finalIngredient];
}

export function findIngredientName(lineIn, volumeStringEndIndex) {
  const words = lineIn
    .toLocaleLowerCase()
    .substring(volumeStringEndIndex + 1)
    .split(" ");
  var wordIndex = 0;
  var testWord = words[wordIndex++];
  // Skip any non-ingredient words
  while (!isIngredientWord(testWord) && wordIndex < words.length) {
    testWord = words[wordIndex++];
  }
  while (!isIngredientName(testWord) && wordIndex < words.length) {
    testWord += " " + words[wordIndex++];
  }
  if (!isIngredientName(testWord)) {
    console.log('Error: unknown ingredient "' + testWord + '"');
    return "";
  }
  return testWord;
}
