import {convertDecimalsToFractions, scaleStringNumberByFactor} from '../utilities/numberConversion';
import {roundDecimalNumber} from '../utilities/stringHelpers';

export class MeasuredIngredient {
  constructor(
      ingredient,
      unitQuantity,
      originalString,
      ingredientName,
      preparationAction,
      recipeScale,
  ) {
    this.ingredient = ingredient;
    this.originalString = convertDecimalsToFractions(
        scaleStringNumberByFactor(originalString, recipeScale));
    this.unitQuantity = unitQuantity.scaledBy(recipeScale);
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
    const amount = roundDecimalNumber(this.unitQuantity.quantity);
    if (this.unitQuantity.unitMeasure.isCountableUnitMeasure) {
      let unitName = this.unitQuantity.unitMeasure.names[0];
      if (unitName[unitName.length - 1] != 's' && amount != 1) {
        unitName += 's';
      }
      return `${amount} ${unitName}`;
    }
    return amount;
  }
  prepString() {
    if (!this.preparationAction) {
      return null;
    }
    return this.preparationAction + ' ' + this.description() + ' ' + this.ingredientName;
  }
}
