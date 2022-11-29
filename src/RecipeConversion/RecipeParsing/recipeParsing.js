import {
  isIngredientWord,
  isIngredientName,
} from "../DataStructures/ingredient";

import { removeSimpleLines } from "./recipePostProcessing";

import { insertNewLinesAround } from "../utilities/stringHelpers";

export function parseRecipe(recipeStringIn) {
  var recipe = recipeStringIn.replaceAll(".", "\n");
  var recipe = recipe.replaceAll(",", " ,");
  var recipe = recipe.replaceAll("\n", " \n");

  recipe = putIngredientsOnOwnLine(recipe);
  recipe = removeSimpleLines(recipe);
  return recipe;
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
    if (ingredientFound != "") {
      [recipe, startIndex] = insertNewLinesAround(
        recipe,
        ingredientFound,
        startIndex
      );
    }
  }

  // If testWord is start of an ingredient put a new line before it and after it
  //
  return recipe;
}
