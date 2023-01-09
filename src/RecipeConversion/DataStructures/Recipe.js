
export const ingredientTextKey = 'ingredientTextKey';
export const recipeTextKey = 'recipeTextKey';
export const recipeNameKey = 'recipeNameKey';
export const recipeDocIdKey = 'recipeDocIdKey';
export const recipeManualEditTextKey = 'recipeManualEditTextKey';

export function makeRecipe(recipeName, ingredientText, recipeText, recipeManualEditText, docId) {
  const obj = {};
  obj[recipeNameKey] = recipeName;
  obj[recipeTextKey] = recipeText;
  obj[ingredientTextKey] = ingredientText;
  obj[recipeManualEditTextKey] = recipeManualEditText;
  obj[recipeDocIdKey] = docId;
  return obj;
}


export function recipeFromDoc(doc) {
  return makeRecipe(
      doc.data()[recipeNameKey],
      doc.data()[ingredientTextKey],
      doc.data()[recipeTextKey],
      doc.data()[recipeManualEditTextKey],
      doc.id);
}

export function prepRecipeForDb(recipe) {
  const localRecipe = recipe;
  delete localRecipe[recipeDocIdKey];
  if (recipe[recipeManualEditTextKey] == null) {
    delete localRecipe[recipeManualEditTextKey];
  }
  return localRecipe;
}
