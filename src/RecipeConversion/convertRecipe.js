import {parseIngredientList} from './RecipeParsing/ingredientParsing';
import {parseRecipe} from './RecipeParsing/recipeParsing';

/** ***************************** */
/*    Public Function        */
/** ***************************** */

/**
 * @param {string} ingredientListStringIn
 */

export const INGREDIENTS_HEADER =
  '=============\n===Ingredients===\n=============\n';
export const RECIPES_HEADER =
  '\n\n=============\n====Recipe=====\n=============\n';
export function convertRecipe(ingredientListStringIn, recipeStringIn, ingredientManager) {
  const [ingredientsString, measuredIngredients] = parseIngredientList(
      ingredientListStringIn, ingredientManager,
  );
  const recipeString = parseRecipe(recipeStringIn, measuredIngredients, ingredientManager);

  return INGREDIENTS_HEADER + ingredientsString + RECIPES_HEADER + recipeString;
}
