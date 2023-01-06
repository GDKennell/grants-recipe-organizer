
export const ingredientTextKey = 'ingredientTextKey';
export const recipeTextKey = 'recipeTextKey';
export const recipeNameKey = 'recipeNameKey';
export const recipeDocIdKey = 'recipeDocIdKey';

export function makeRecipe(recipeName, ingredientText, recipeText, docId) {
  const obj = {};
  obj[recipeNameKey] = recipeName;
  obj[recipeTextKey] = recipeText;
  obj[ingredientTextKey] = ingredientText;
  obj[recipeDocIdKey] = docId;
  return obj;
}


export function recipeFromDoc(doc) {
  return makeRecipe(
      doc.data()[recipeNameKey],
      doc.data()[ingredientTextKey],
      doc.data()[recipeTextKey],
      doc.id);
}

export function prepRecipeForDb(recipe) {
  const localRecipe = recipe;
  delete localRecipe[recipeDocIdKey];
  return localRecipe;
}
