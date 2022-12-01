import { roundDecimalNumber } from "../utilities/stringHelpers";

export class MeasuredIngredient {
  constructor(ingredient, volumeInCups, volumeString) {
    this.ingredient = ingredient;
    this.volumeInCups = volumeInCups;
    this.volumeString = volumeString;
  }
  weightInGrams() {
    return roundDecimalNumber(this.volumeInCups * this.ingredient.gramsPerCup);
  }
  description() {
    return this.weightInGrams() + "g (" + this.volumeString + ")";
  }
}
