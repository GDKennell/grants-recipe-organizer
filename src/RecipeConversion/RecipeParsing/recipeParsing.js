import {findIngredientName} from './ingredientParsing';
import {removeSimpleLines} from './recipePostProcessing';

import {findVolumeStringBefore} from './volumeParsing';

import {
  debugString,
  insertNewLinesAround,
  isLineAllWhitespace,
  stringContains,
  strInsert,
  strRemoveRange,
} from '../utilities/stringHelpers';
import {convertFractionsToDecimals} from '../utilities/numberConversion';


export function parseRecipe(recipeStringIn, measuredIngredients, ingredientManager) {
  let recipe = recipeStringIn.replaceAll('.', '\n');
  recipe = recipe.replaceAll(',', ' ,');
  recipe = recipe.replaceAll('\n', ' \n ');
  recipe = convertFractionsToDecimals(recipe);

  // Todo: pre-process removing all double spaces (should only be single spaces)

  recipe = putIngredientsOnOwnLine(recipe, ingredientManager);
  recipe = addAndConvertIngredientUnits(recipe, measuredIngredients, ingredientManager);
  recipe = removeSimpleLines(recipe);
  recipe = removeRedundantWords(recipe);
  recipe = moveCommaListsToBulletOnes(recipe);
  recipe = insertMultiLineStepMarkers(recipe);
  return recipe;
}


function addAndConvertIngredientUnits(recipeStringIn, measuredIngredients, ingredientManager) {
  if (measuredIngredients == undefined) {
    return recipeStringIn;
  }
  const nameToMeasured = {};
  for (const measuredIngredient of measuredIngredients) {
    for (const name of measuredIngredient.ingredient.names) {
      nameToMeasured[name.toLocaleLowerCase()] = measuredIngredient;
      nameToMeasured[name.toLocaleLowerCase() + 's'] = measuredIngredient;
    }
  }
  const lines = recipeStringIn.split('\n');
  let finalString = '';
  for (const line of lines) {
    const [ingredientName] = findIngredientName(line, 0, ingredientManager);
    if (ingredientName == '') {
      finalString += line + '\n';
      continue;
    }
    const measuredIngredient = nameToMeasured[ingredientName];
    if (measuredIngredient == undefined) {
      finalString += line + '\n';
      continue;
    }
    let newLine = line;
    const startIndex = line.indexOf(ingredientName);
    newLine = strInsert(
        newLine,
        measuredIngredient.description() + ' ',
        startIndex,
    );
    finalString += newLine + '\n';
  }
  return finalString;
}

export function putIngredientsOnOwnLine(recipeStringIn, ingredientManager) {
  let recipe = recipeStringIn;
  // check each word if it's start of an ingredient
  let [ingredientName, ingredientEndIndex] = findIngredientName(recipe, 0, ingredientManager);

  // TODO: handle case where false positive of ingredient word and need to backtrack to the next word
  // e.g. we have ingredients "unbleached flour" and "milk"
  // And text contains "unbleached milk". must still find milk
  const max = 10;
  let num = 0;
  while (ingredientName != '') {
    if (num++ > max) {
      console.error(`putIngredientsOnOwnLine saftey early return`);
      return recipe;
    }
    let ingredientStartIndex = ingredientEndIndex - ingredientName.length - 1;
    // TODO: swap this to findUnitMeasureString()
    const [volumeString, ,] = findVolumeStringBefore(
        recipe,
        ingredientName,
        ingredientStartIndex,
    );
    if (volumeString != '') {
      ingredientStartIndex -= volumeString.length;
      ingredientName = volumeString + ' ' + ingredientName;
    }
    [recipe, ingredientEndIndex] = insertNewLinesAround(
        recipe,
        ingredientName,
        ingredientStartIndex,
    );
    [ingredientName, ingredientEndIndex] = findIngredientName(
        recipe,
        ingredientEndIndex, ingredientManager,
    );
  }

  return recipe;
}

function removeRedundantWords(recipeStringIn) {
  const redundantWords = ['next', 'then'];
  let recipe = recipeStringIn;
  for (const word of redundantWords) {
    let index = recipe.toLocaleLowerCase().indexOf(word);
    while (index != -1) {
      // Check if it's followed by [whitespace] [comma], if so include that
      // Remove this from the string
      let endIndex = index + word.length;
      while (stringContains(' ,', recipe[endIndex])) {
        endIndex++;
      }
      recipe = strRemoveRange(recipe, index, endIndex);
      index = recipe.toLocaleLowerCase().indexOf(word);
    }
  }
  return recipe;
}

function moveCommaListsToBulletOnes(recipeStringIn) {
  return recipeStringIn.replaceAll(',', '\n - - ');
}

function insertMultiLineStepMarkers(recipeStringIn) {
  const lines = recipeStringIn.split('\n');
  const finalLines = [];
  for (const line of lines) {
    if (!isLineAllWhitespace(line)) {
      finalLines.push('> ' + line);
    } else {
      finalLines.push(line);
    }
  }
  return finalLines.join('\n');
}
