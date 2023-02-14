import {parseIngredientList} from './RecipeParsing/ingredientParsing';
import {parseRecipe} from './RecipeParsing/recipeParsing';

/** ***************************** */
/*    Public Function        */
/** ***************************** */


export const INGREDIENTS_HEADER =
  '=============\n===Ingredients===\n=============\n';
export const RECIPES_HEADER =
  '\n\n=============\n====Recipe=====\n=============\n';

/**
 * @param {string} ingredientListStringIn
 */

export function convertRecipe(ingredientListStringIn, recipeStringIn, ingredientManager, recipeScale = 1.0) {
  const {ingredientsString, measuredIngredients} = parseIngredientList(
      ingredientListStringIn, ingredientManager, recipeScale,
  );

  const recipeString = parseRecipe(recipeStringIn, measuredIngredients, ingredientManager, recipeScale);
  return {ingredientsString: ingredientsString, recipeString: recipeString};
}

export function combineIngredientsAndRecipe(ingredientsString, recipeString) {
  return INGREDIENTS_HEADER + ingredientsString + RECIPES_HEADER + recipeString;
}
