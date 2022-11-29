import { containsVolumeMeasurement } from "../DataStructures/volumeMeasures";
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

export function parseIngredientList(ingredientListStringIn) {
  const lines = ingredientListStringIn.split("\n");
  const newLines = lines.map(parseIngredientListLine);
  return newLines.join("\n");
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
    return lineIn;
  }

  //  ------- Finding Volume Amount ------------ //

  const [volumeStringStartIndex, volumeInCups, volumeStringEndIndex] =
    findVolumeString(newLine);

  //  ------- Finding Ingredient Name  ------------ //

  const ingredientName = findIngredientName(newLine, volumeStringEndIndex);
  if (ingredientName == "") {
    return lineIn;
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
  return finalString;
}

function findIngredientName(lineIn, volumeStringEndIndex) {
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
