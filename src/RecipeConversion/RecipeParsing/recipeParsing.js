import {
  isIngredientWord,
  isIngredientName,
} from "../DataStructures/ingredient";
import { findIngredientName } from "./ingredientParsing";
import { removeSimpleLines } from "./recipePostProcessing";

import { findVolumeStringBefore } from "./volumeParsing";

import {
  insertNewLinesAround,
  stringContains,
  strInsert,
} from "../utilities/stringHelpers";
import { convertFractionsToDecimals } from "../utilities/numberConversion";

export function parseRecipe(recipeStringIn, measuredIngredients) {
  var recipe = recipeStringIn.replaceAll(".", "\n");
  var recipe = recipe.replaceAll(",", " ,");
  var recipe = recipe.replaceAll("\n", " \n ");
  var recipe = convertFractionsToDecimals(recipe);

  // Todo: pre-process removing all double spaces (should only be single spaces)

  recipe = putIngredientsOnOwnLine(recipe);
  recipe = addAndConvertIngredientUnits(recipe, measuredIngredients);
  recipe = removeSimpleLines(recipe);
  return recipe;
}

function addAndConvertIngredientUnits(recipeStringIn, measuredIngredients) {
  if (measuredIngredients == undefined) {
    return recipeStringIn;
  }
  var nameToMeasured = {};
  for (const measuredIngredient of measuredIngredients) {
    for (const name of measuredIngredient.ingredient.names) {
      nameToMeasured[name.toLocaleLowerCase()] = measuredIngredient;
      nameToMeasured[name.toLocaleLowerCase() + "s"] = measuredIngredient;
    }
  }
  const lines = recipeStringIn.split("\n");
  var finalString = "";
  for (const line of lines) {
    const ingredientName = findIngredientName(line, 0);
    if (ingredientName == "") {
      finalString += line + "\n";
      continue;
    }
    const measuredIngredient = nameToMeasured[ingredientName];
    if (measuredIngredient == undefined) {
      finalString += line + "\n";
      continue;
    }
    var newLine = line;
    const startIndex = line.indexOf(ingredientName);
    newLine = strInsert(
      newLine,
      measuredIngredient.description() + " ",
      startIndex
    );
    finalString += newLine + "\n";
  }
  return finalString;
}

function putIngredientsOnOwnLine(recipeStringIn) {
  var recipe = recipeStringIn;
  var words = recipe.split(" ");
  // check each word if it's start of an ingredient
  var testString = "";
  var startIndex = 0;
  // TODO: handle case where false positive of ingredient word and need to backtrack to the next word
  // e.g. we have ingredients "unbleached flour" and "milk"
  // And text contains "unbleached milk". must still find milk
  for (
    var startWordIndex = 0;
    startWordIndex < words.length;
    startWordIndex++
  ) {
    // TODO: Refactor this ingredient parsing into a helper function
    const startWord = words[startWordIndex];
    testString = startWord;
    var word = startWord;
    var innerIndex = startWordIndex + 1;
    var ingredientFound = "";
    while (isIngredientWord(word)) {
      if (isIngredientName(testString)) {
        ingredientFound = testString;
      } else if (innerIndex >= words.length) {
        break;
      }
      word = words[innerIndex++];
      testString += " " + word;
    }
    if (ingredientFound == "") {
      continue;
    }
    const numWordsInIngredient = ingredientFound.split(" ").length;
    startWordIndex += numWordsInIngredient - 1;

    const [volumeString, volumeType, quantity] = findVolumeStringBefore(
      recipe,
      ingredientFound,
      startIndex
    );
    if (volumeString != "") {
      if (!stringContains(recipeStringIn, volumeString)) {
        console.log(
          "ERROR: parsed non existent volume measurement " +
            volumeString +
            " before ingredient " +
            ingredientFound
        );
      }
      startIndex -= volumeString.length;
      ingredientFound = volumeString + " " + ingredientFound;
    }
    [recipe, startIndex] = insertNewLinesAround(
      recipe,
      ingredientFound,
      startIndex
    );
  }

  // If testWord is start of an ingredient put a new line before it and after it
  //
  return recipe;
}
