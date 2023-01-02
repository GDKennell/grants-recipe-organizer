import {containsUnitMeasurement} from '../DataStructures/unitMeasure';

import {
  wordsToNumbers,
  convertFractionsToDecimals,
} from '../utilities/numberConversion';


import {findUnitMeasureString} from './volumeParsing';
import {MeasuredIngredient} from '../DataStructures/measuredIngredient';
import {
  removeLeadingWhiteSpace,
  removeSpacesBeforePunctuation,
  strRemoveRange,
  sanitizePunctuation,
} from '../utilities/stringHelpers';

export function parseIngredientList(ingredientListStringIn, ingredientManager) {
  const lines = ingredientListStringIn.split('\n');
  const newLines = [];
  const measuredIngredients = [];
  for (const line of lines) {
    const [newLine,, measuredIngredient] = parseIngredientListLine(line, ingredientManager);
    newLines.push(newLine);
    if (measuredIngredient != null) {
      measuredIngredients.push(measuredIngredient);
    }
  }
  const finalString = newLines.join('\n');
  return [finalString, measuredIngredients];
}

/**
 * @param {string} lineIn
 */
export function parseIngredientListLine(lineIn, ingredientManager) {
  //  ------- Pre Processing ------------ //
  let newLine = wordsToNumbers(lineIn);
  newLine = convertFractionsToDecimals(newLine);
  newLine = sanitizePunctuation(newLine);

  const defaultLine = postProcessIngredientLine(lineIn);
  if (!containsUnitMeasurement(newLine)) {
    return [defaultLine, defaultLine, null];
  }

  //  ------- Finding Volume Amount ------------ //

  const [
    unitStringStartIndex,
    volumeInCups,
    weightInGrams,
    unitQuantity,
    unitStringEndIndex,
  ] = findUnitMeasureString(newLine);

  if (unitStringStartIndex == -1) {
    return [defaultLine, defaultLine, null];
  }

  //  ------- Finding Ingredient Name  ------------ //

  const [ingredientName] = findIngredientName(
      newLine,
      unitStringStartIndex, ingredientManager,
  );
  if (ingredientName == '') {
    const possibleIngredient = strRemoveRange(newLine, unitStringStartIndex, unitStringEndIndex);
    return [defaultLine, removeLeadingWhiteSpace(possibleIngredient), null];
  }
  const ingredient = ingredientManager.findIngredientByName(ingredientName);

  //  ------- Conversion & String Building ------------ //

  const oldUnitMeasurementString = newLine.substring(
      unitStringStartIndex,
      unitStringEndIndex,
  );

  const prefix = newLine.substring(0, unitStringStartIndex);
  const suffix = newLine.substring(unitStringEndIndex);
  const finalIngredient = new MeasuredIngredient(
      ingredient,
      volumeInCups,
      weightInGrams,
      unitQuantity,
      oldUnitMeasurementString,
  );
  let finalString = prefix + finalIngredient.description() + suffix;

  //  ------- Post Processing ------------ //
  finalString = postProcessIngredientLine(finalString);

  return [finalString, ingredientName, finalIngredient];
}

function postProcessIngredientLine(line) {
  let finalString = removeSpacesBeforePunctuation(line);
  finalString = removeLeadingWhiteSpace(finalString);
  return finalString;
}

export function findIngredientName(lineIn, startIndex, ingredientManager) {
  const words = lineIn
      .toLocaleLowerCase()
      .substring(startIndex + 1)
      .split(' ');
  console.log(`findIngredientName: line substring: ${lineIn
      .toLocaleLowerCase()
      .substring(startIndex + 1)}`);
  console.log(`findIngredientName(starting at ${startIndex})`);
  if (startIndex > 130) {
    console.log('Saftey early return ');
    // return ['', 0];
  }
  let testString = '';
  let ingredientFound = '';
  for (
    let startWordIndex = 0;
    startWordIndex < words.length;
    startWordIndex++
  ) {
    const startWord = words[startWordIndex];
    testString = startWord;
    let word = startWord;
    let innerIndex = startWordIndex + 1;

    while (ingredientManager.isIngredientWord(word)) {
      if (ingredientManager.isIngredientName(testString)) {
        ingredientFound = testString;
      }
      if (innerIndex >= words.length) {
        break;
      }
      word = words[innerIndex++];
      testString += ' ' + word;
    }
    if (ingredientFound != '') {
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

