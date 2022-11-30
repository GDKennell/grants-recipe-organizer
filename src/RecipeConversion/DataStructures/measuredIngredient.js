export class MeasuredIngredient {
  constructor(ingredient, volumeInCups, volumeString) {
    this.ingredient = ingredient;
    this.volumeInCups = volumeInCups;
    this.volumeString = volumeString;
  }
  weightInGrams() {
    return (this.volumeInCups * this.ingredient.gramsPerCup).toFixed(2);
  }
  description() {
    return this.weightInGrams() + "g (" + this.volumeString + ")";
  }
}
