import {convertDecimalsToFractions} from '../utilities/numberConversion';
import {roundDecimalNumber} from '../utilities/stringHelpers';

export class MeasuredIngredient {
  constructor(
      ingredient,
      unitQuantity,
      originalString,
      ingredientName,
      preparationAction,
  ) {
    this.ingredient = ingredient;
    this.originalString = convertDecimalsToFractions(originalString);
    this.unitQuantity = unitQuantity;
    this.ingredientName = ingredientName;
    this.preparationAction = preparationAction;
  }
  getWeightInGrams() {
    if (this.unitQuantity.unitMeasure.isWeightMeasure) {
      return this.unitQuantity.unitMeasure.ratioToGram * this.unitQuantity.quantity;
    }
    if (this.unitQuantity.unitMeasure.isVolumeMeasure) {
      return this.unitQuantity.unitMeasure.ratioToCup *
              this.unitQuantity.quantity *
              this.ingredient.gramsPerCup;
    }
    return null;
  }
  description() {
    const weight = this.getWeightInGrams();
    if (weight != null) {
      return (
        roundDecimalNumber(weight) + 'g' + ' (' + this.originalString + ')'
      );
    }
    return roundDecimalNumber(this.unitQuantity.quantity);
  }
  prepString() {
    if (!this.preparationAction) {
      return null;
    }
    return this.preparationAction + ' ' + this.description() + ' ' + this.ingredientName;
  }
}
