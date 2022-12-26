import {isValidNumberString, removeAllWhitespace} from '../RecipeConversion/utilities/stringHelpers';


export function isIngredientValid(namesText, gramsPerCupText) {
  const gramsPerCupValue = parseFloat(gramsPerCupText);
  if (!isValidNumberString(gramsPerCupText)) {
    console.log('! isValidNumberString ');
    return false;
  }
  if (isNaN(gramsPerCupValue)) {
    console.log('isNaN');
    return false;
  }
  if (removeAllWhitespace(namesText).length == 0) {
    return false;
  }
  return true;
}

export function isNewIngredientValid(gramsPerCupText, namesText, ingredientManager, allowedIngredient) {
  if (!isIngredientValid(namesText, gramsPerCupText)) {
    return false;
  }
  const words = namesText.split(',');
  for (const word of words ) {
    if (ingredientManager.isIngredientName(word) ) {
      const foundIng = ingredientManager.findIngredientByName(word);
      if (allowedIngredient != null &&
        foundIng.key == allowedIngredient.key) {
        return true;
      }
      return false;
    }
  }
  return true;
};

