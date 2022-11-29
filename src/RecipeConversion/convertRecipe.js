import {
  wordsToNumbers,
  convertFractionsToDecimals,
  sanitizePunctuation,
  removeSpacesBeforePunctuation,
} from "./utilities/numberConversion";
import { parseIngredientList } from "./RecipeParsing/ingredientParsing";
import { parseRecipe } from "./RecipeParsing/recipeParsing";

/** ***************************** */
/*    Public Function        */
/** ***************************** */

/**
 * @param {string} ingredientListStringIn
 */
export function convertRecipe(ingredientListStringIn, recipeStringIn) {
  const ingredientsString = parseIngredientList(ingredientListStringIn);
  const recipeString = parseRecipe(recipeStringIn);
  const ingredientsHeader = "=============\n===Ingredients===\n=============\n";
  const recipeHeader = "\n\n=============\n====Recipe=====\n=============\n";
  return ingredientsHeader + ingredientsString + recipeHeader + recipeString;
}
