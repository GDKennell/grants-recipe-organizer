export class Ingredient {
  constructor(names, gramsPerCup) {
    this.names = names;
    this.gramsPerCup = gramsPerCup;
  }
}

export function isIngredientWord(str) {
  if (str == undefined) {
    return false;
  }
  return allIngredientWords.includes(str.toLocaleLowerCase());
}

export function isIngredientName(strIn) {
  var str = strIn;
  if (str[str.length - 1] == " ") {
    str = str.substring(0, str.length - 1);
  }
  return allIngredientNameStrings.includes(str.toLocaleLowerCase());
}

export function findIngredientByName(ingredientName) {
  return nameToIngredient[ingredientName];
}

const butter = new Ingredient(
  ["butter", "unsalted butter", "salted butter", "melted butter"],
  227.0
);

const Flour = new Ingredient(
  ["Flour", "All purpose flour", "all-purpose flour"],
  125.0
);
const Parmesan_cheese = new Ingredient(["Parmesan cheese"], 100.0);
const Honey = new Ingredient(["Honey"], 337.6);
const Sugar = new Ingredient(["Sugar", "Granulated sugar"], 198.0);
const Dried_Basil = new Ingredient(["Dried Basil", "basil"], 72.0);
const Brown_sugar = new Ingredient(["Brown sugar"], 192.0);
const Evaporated_milk = new Ingredient(["Evaporated milk"], 252.0);
const Yeast = new Ingredient(["Yeast", "active dry yeast"], 192.0);
const Water = new Ingredient(["Water"], 236.6);
const Poppy_seeds = new Ingredient(["Poppy seeds"], 140.8);
const Sesame_seeds = new Ingredient(["Sesame seeds"], 245.0);
const Salt = new Ingredient(["Salt", "Sea Salt", "seasalt"], 288.0);
const Yogurt = new Ingredient(["Yogurt"], 245.0);
const Olive_oil = new Ingredient(["Olive oil", "oil"], 216.0);
const Five_Spice_mix = new Ingredient(
  ["5 Spice mix", "Five Spice Mix", "Five Spice"],
  120.0
);
const Soy_Sauce = new Ingredient(["Soy Sauce"], 248.0);
const Shaoxing_Wine = new Ingredient(["Shaoxing Wine"], 236.0);
const Garlic_powder = new Ingredient(["Garlic powder"], 155.2);
const Black_pepper = new Ingredient(["Black pepper"], 110.0);
const Baking_powder = new Ingredient(["Baking powder"], 220.8);
const Baking_soda = new Ingredient(["Baking soda"], 220.8);
const Thyme = new Ingredient(["Thyme"], 68.8);
const Milk = new Ingredient(["Milk"], 223.0); // 2%
const Heavy_cream = new Ingredient(["Heavy cream", "cream"], 238.0);
const Monterey_Jack_cheese = new Ingredient(["Monterey Jack cheese"], 112.0);
const Cottage_cheese = new Ingredient(["Cottage cheese"], 226.0);
const Cajun_seasoning = new Ingredient(["Cajun seasoning"], 172.0);
const Oregano = new Ingredient(["Oregano"], 86.4);
const Cornstarch = new Ingredient(["Cornstarch"], 128.0);
const Walnuts = new Ingredient(["Walnuts"], 120.0);
const Cinnamon = new Ingredient(["Cinnamon"], 124.8);
const Ginger = new Ingredient(["Ginger"], 83.2);
const Nutmeg = new Ingredient(["Nutmeg"], 112.0);
const Cloves = new Ingredient(["Cloves"], 104.0); // ground
const Onion_salt = new Ingredient(["Onion salt"], 225.6);
const Paprika = new Ingredient(["Paprika"], 108.8);
const Chili_powder = new Ingredient(["Chili powder"], 1.0);
const Vanilla_Extract = new Ingredient(["Vanilla Extract"], 208.0);
const Vinegar = new Ingredient(["Vinegar", "white vinegar"], 238.0); // Distilled white
const Vodka = new Ingredient(
  ["Vodka", "rum", "whiskey", "gin", "tequila"],
  224.0
);
const Shortening = new Ingredient(["Shortening"], 205.0);
const Beer = new Ingredient(["Beer"], 236.0);
const Cream_Of_Tartar = new Ingredient(["Cream of tartar"], 144.0);
const allIngredients = [
  butter,
  Flour,
  Parmesan_cheese,
  Honey,
  Sugar,
  Dried_Basil,
  Brown_sugar,
  Evaporated_milk,
  Yeast,
  Water,
  Poppy_seeds,
  Sesame_seeds,
  Salt,
  Yogurt,
  Olive_oil,
  Five_Spice_mix,
  Soy_Sauce,
  Shaoxing_Wine,
  Garlic_powder,
  Black_pepper,
  Baking_powder,
  Baking_soda,
  Thyme,
  Milk,
  Heavy_cream,
  Monterey_Jack_cheese,
  Cottage_cheese,
  Cajun_seasoning,
  Oregano,
  Cornstarch,
  Walnuts,
  Cinnamon,
  Ginger,
  Nutmeg,
  Cloves,
  Onion_salt,
  Paprika,
  Chili_powder,
  Vanilla_Extract,
  Vinegar,
  Vodka,
  Shortening,
  Beer,
  Cream_Of_Tartar,
];

const allIngredientNameStrings = allIngredients
  .flatMap((m) => m.names)
  .map((m) => m.toLocaleLowerCase());
const allIngredientWords = allIngredientNameStrings.flatMap((m) =>
  m.toLocaleLowerCase().split(" ")
);

var nameToIngredient = {};
for (const ingredient of allIngredients) {
  for (const name of ingredient.names) {
    nameToIngredient[name.toLocaleLowerCase()] = ingredient;
  }
}