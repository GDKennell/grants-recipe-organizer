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
  description(recipeScale = 1.0) {
    const weight = this.getWeightInGrams();
    if (weight != null) {
      return (
        roundDecimalNumber(weight * recipeScale) + 'g' + ' (' + this.originalString + ')'
      );
    }
    const amount = roundDecimalNumber(this.unitQuantity.quantity * recipeScale);
    if (this.unitQuantity.unitMeasure.isCountableUnitMeasure) {
      let unitName = this.unitQuantity.unitMeasure.names[0];
      if (unitName[unitName.length - 1] != 's' && amount != 1) {
        unitName += 's';
      }
      return `${amount} ${unitName}`;
    }
    return amount;
  }
  prepString(recipeScale = 1.0) {
    if (!this.preparationAction) {
      return null;
    }
    return this.preparationAction + ' ' + this.description(recipeScale) + ' ' + this.ingredientName;
  }
}
