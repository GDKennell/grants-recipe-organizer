import {convertDecimalsToFractions} from '../utilities/numberConversion';
import {roundDecimalNumber} from '../utilities/stringHelpers';

export class MeasuredIngredient {
  constructor(
      ingredient,
      volumeInCups,
      weightInGrams,
      unitQuantity,
      originalString,
      ingredientName,
      preparationAction,
  ) {
    this.ingredient = ingredient;
    this.volumeInCups = isNaN(volumeInCups) ? null : volumeInCups;
    this.originalString = convertDecimalsToFractions(originalString);
    this.weightInGrams = isNaN(weightInGrams) ? null : weightInGrams;
    this.unitQuantity = unitQuantity;
    this.ingredientName = ingredientName;
    this.preparationAction = preparationAction;
  }
  getWeightInGrams() {
    const convertedWeight =
      this.volumeInCups != null ?
          this.volumeInCups * this.ingredient.gramsPerCup :
          null;
    return this.weightInGrams ?? convertedWeight;
  }
  description() {
    const weight = this.getWeightInGrams();
    if (weight != null) {
      return (
        roundDecimalNumber(weight) + 'g' + ' (' + this.originalString + ')'
      );
    }
    return roundDecimalNumber(this.unitQuantity);
  }
  prepString() {
    if (!this.preparationAction) {
      return null;
    }
    return this.preparationAction + ' ' + this.description() + ' ' + this.ingredientName;
  }
}
