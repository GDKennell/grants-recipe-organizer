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
  strIndexOfWord,
  capitalizeWordsInString,
  wordBefore,
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
  const ingredientsString = newLines.join('\n');
  return {ingredientsString: ingredientsString, measuredIngredients: measuredIngredients};
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
  newLine = capitalizeWordsInString(newLine, ingredientName);
  const ingredient = ingredientManager.findIngredientByName(ingredientName);

  //  ------- Conversion & String Building ------------ //

  const oldUnitMeasurementString = newLine.substring(
      unitStringStartIndex,
      unitStringEndIndex,
  );
  const preparationAction = findPreparationAction(newLine);

  const prefix = newLine.substring(0, unitStringStartIndex);
  const suffix = newLine.substring(unitStringEndIndex);
  const finalIngredient = new MeasuredIngredient(
      ingredient,
      unitQuantity,
      oldUnitMeasurementString,
      ingredientName,
      preparationAction,
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

function findPreparationAction(lineIn) {
  const line = lineIn.toLocaleLowerCase();
  const modifiers = ['thinly', 'finely'];
  const resultToSteps = {'melted': 'melt',
    'chopped': 'chop',
    'sliced': 'slice',
    'grated': 'grate',
    'minced': 'mince',
    'halved': 'chop in half',
    'shredded': 'shred',
    'drained and rinsed': 'drain and rinse',
    'drained': 'drain',
    'rinsed': 'rinse',
  };
  const keys = Object.keys(resultToSteps);
  let foundWord = null;
  let foundWordIndex = 0;
  for (const key of keys) {
    if (strIndexOfWord(line, key) != -1) {
      foundWord = resultToSteps[key];
      foundWordIndex = strIndexOfWord(line, key);
      break;
    }
  }
  if (foundWord) {
    const [previousWord] = wordBefore(line, foundWordIndex);
    if (modifiers.includes(previousWord.toLocaleLowerCase())) {
      foundWord = `${previousWord} ${foundWord}`;
    }
  }
  return foundWord;
}

 function specialCaseSkipIngredientWord(word, lineIn) {
  const words = lineIn
      .toLocaleLowerCase()
      .split(' ');

  if (words.includes('garlic') && (word == 'clove' || word == 'cloves')) {
    return true;
  }
  return false;
}

export function findIngredientName(lineIn, startIndex, ingredientManager) {
  const words = lineIn
      .toLocaleLowerCase()
      .substring(startIndex)
      .split(' ');
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

    while (ingredientManager.isIngredientWord(word) && !specialCaseSkipIngredientWord(word, lineIn)) {
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

