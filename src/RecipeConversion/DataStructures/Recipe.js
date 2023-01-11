import {convertRecipe} from '../convertRecipe';

export const ingredientTextKey = 'ingredientTextKey';
export const recipeTextKey = 'recipeTextKey';
export const recipeNameKey = 'recipeNameKey';
export const recipeDocIdKey = 'recipeDocIdKey';
export const recipeManualEditTextKey = 'recipeManualEditTextKey';
export const recipeIsPublicKey = 'recipeIsPublicKey';

export function makeRecipe(recipeName, ingredientText, recipeText, recipeManualEditText, isPublic, docId) {
  const obj = {};
  obj[recipeNameKey] = recipeName;
  obj[recipeTextKey] = recipeText;
  obj[ingredientTextKey] = ingredientText;
  obj[recipeManualEditTextKey] = recipeManualEditText;
  obj[recipeIsPublicKey] = isPublic;
  obj[recipeDocIdKey] = docId;
  return obj;
}

export function recipeFromDoc(doc) {
  return makeRecipe(
      doc.data()[recipeNameKey],
      doc.data()[ingredientTextKey],
      doc.data()[recipeTextKey],
      doc.data()[recipeManualEditTextKey],
      doc.data()[recipeIsPublicKey] || false,
      doc.id);
}

export function prepRecipeForDb(recipe) {
  const localRecipe = recipe;
  delete localRecipe[recipeDocIdKey];
  if (localRecipe[recipeManualEditTextKey] == null) {
    delete localRecipe[recipeManualEditTextKey];
  }
  localRecipe[recipeIsPublicKey] = localRecipe[recipeIsPublicKey] || false;
  return localRecipe;
}

export function getIngredientsFromRecipe(recipe, ingredientManager) {
  // const manual = recipe[recipeManualEditTextKey];
  // if (manual && manual.length > 0) {
  //   return manual;
  // }
  const {ingredientsString} = convertRecipe(recipe[ingredientTextKey],
      recipe[recipeTextKey],
      ingredientManager);
  return ingredientsString;
}


export function getStepsFromRecipe(recipe, ingredientManager) {
  // const manual = recipe[recipeManualEditTextKey];
  // if (manual && manual.length > 0) {
  //   return manual;
  // }
  const {recipeString} = convertRecipe(recipe[ingredientTextKey],
      recipe[recipeTextKey],
      ingredientManager);
  return recipeString;
}

export function hasManualEdits(recipe) {
  return recipe[recipeManualEditTextKey] != null && recipe[recipeManualEditTextKey].length > 0;
}
