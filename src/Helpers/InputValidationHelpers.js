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

export function isNewIngredientValid(gramsPerCupText, namesText, ingredientManager) {
  if (!isIngredientValid(namesText, gramsPerCupText)) {
    return false;
  }
  const words = namesText.split(',');
  for (const word of words ) {
    if (ingredientManager.isIngredientName(word) ) {
      return false;
    }
  }
  return true;
};

