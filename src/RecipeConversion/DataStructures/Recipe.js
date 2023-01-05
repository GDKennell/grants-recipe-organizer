
export const ingredientTextKey = 'ingredientTextKey';
export const recipeTextKey = 'recipeTextKey';
export const recipeNameKey = 'recipeNameKey';


export function makeRecipe(recipeName, ingredientText, recipeText) {
  const obj = {};
  obj[ingredientTextKey] = ingredientText;
  obj[recipeTextKey] = recipeText;
  obj[recipeNameKey] = recipeName;
  return obj;
}


