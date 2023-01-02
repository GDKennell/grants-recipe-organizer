import {convertDecimalsToFractions} from '../utilities/numberConversion';
import {roundDecimalNumber} from '../utilities/stringHelpers';

export class MeasuredIngredient {
  constructor(
      ingredient,
      volumeInCups,
      weightInGrams,
      unitQuantity,
      originalString,
  ) {
    this.ingredient = ingredient;
    this.volumeInCups = isNaN(volumeInCups) ? null : volumeInCups;
    this.originalString = convertDecimalsToFractions(originalString);
    this.weightInGrams = isNaN(weightInGrams) ? null : weightInGrams;
    this.unitQuantity = unitQuantity;
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
}
