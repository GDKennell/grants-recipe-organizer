import {makeIngredientObject} from './ingredient';

const butter = makeIngredientObject(
    ['butter', 'unsalted butter', 'salted butter', 'melted butter'],
    227.0,
);

const Flour = makeIngredientObject(
    ['Flour', 'All purpose flour', 'all-purpose flour'],
    125.0,
);
const Parmesan_cheese = makeIngredientObject(['Parmesan cheese'], 100.0);
const Honey = makeIngredientObject(['Honey'], 337.6);
const Sugar = makeIngredientObject(['Sugar', 'Granulated sugar'], 198.0);
const Dried_Basil = makeIngredientObject(['Dried Basil', 'basil'], 72.0);
const Brown_sugar = makeIngredientObject(['Brown sugar'], 192.0);
const Evaporated_milk = makeIngredientObject(['Evaporated milk'], 252.0);
const Yeast = makeIngredientObject(['Yeast', 'active dry yeast'], 192.0);
const Water = makeIngredientObject(['Water'], 236.6);
const Poppy_seeds = makeIngredientObject(['Poppy seeds'], 140.8);
const Sesame_seeds = makeIngredientObject(['Sesame seeds'], 245.0);
const Salt = makeIngredientObject(['Salt', 'Sea Salt', 'seasalt'], 288.0);
const Yogurt = makeIngredientObject(['Yogurt'], 245.0);
const Olive_oil = makeIngredientObject(
    ['Olive oil', 'oil', 'canola oil', 'vegetable oil', 'peanut oil'],
    216.0,
);
const Parm_reg = makeIngredientObject(
    ['Parmigiano Reggiano',
      'Parmigiano Reggiano cheese',
      'Parmigiano-Reggiano',
      'Parmigiano-Reggiano cheese',
    ],
    448,
);
const Five_Spice_mix = makeIngredientObject(
    ['5 Spice mix', 'Five Spice Mix', 'Five Spice'],
    120.0,
);
const Soy_Sauce = makeIngredientObject(['Soy Sauce'], 248.0);
const Shaoxing_Wine = makeIngredientObject(['Shaoxing Wine'], 236.0);
const Garlic_powder = makeIngredientObject(['Garlic powder'], 155.2);
const Black_pepper = makeIngredientObject(['Black pepper'], 110.0);
const Baking_powder = makeIngredientObject(['Baking powder'], 220.8);
const Baking_soda = makeIngredientObject(['Baking soda'], 220.8);
const Thyme = makeIngredientObject(['Thyme'], 68.8);
const Milk = makeIngredientObject(['Milk'], 244.0); // 2%
const Heavy_cream = makeIngredientObject(['Heavy cream', 'cream'], 238.0);
const Monterey_Jack_cheese = makeIngredientObject(['Monterey Jack cheese'], 112.0);
const Cottage_cheese = makeIngredientObject(['Cottage cheese'], 226.0);
const Cajun_seasoning = makeIngredientObject(['Cajun seasoning'], 172.0);
const Oregano = makeIngredientObject(['Oregano'], 86.4);
const Cornstarch = makeIngredientObject(['Cornstarch'], 128.0);
const Walnuts = makeIngredientObject(['Walnuts'], 120.0);
const Cinnamon = makeIngredientObject(['Cinnamon'], 124.8);
const Ginger = makeIngredientObject(['Ginger'], 83.2);
const Nutmeg = makeIngredientObject(['Nutmeg'], 112.0);
const Cumin = makeIngredientObject(
    ['cumin', 'ground cumin', 'ground cumin seed'],
    96,
);
const Cloves = makeIngredientObject(['Cloves'], 104.0); // ground
const Onion_salt = makeIngredientObject(['Onion salt'], 225.6);
const Paprika = makeIngredientObject(['Paprika'], 108.8);
const Chili_powder = makeIngredientObject(['Chili powder'], 128.0);
const Vanilla_Extract = makeIngredientObject(['Vanilla Extract'], 208.0);
const Vinegar = makeIngredientObject(['Vinegar', 'white vinegar'], 238.0); // Distilled white
const Vodka = makeIngredientObject(
    ['Vodka', 'rum', 'whiskey', 'gin', 'tequila'],
    224.0,
);
const Shortening = makeIngredientObject(['Shortening'], 205.0);
const Beer = makeIngredientObject(['Beer'], 236.0);
const Cream_Of_Tartar = makeIngredientObject(['Cream of tartar'], 144.0);
const Mochiko_Flour = makeIngredientObject(
    ['Mochiko', 'Mochiko Flour', 'sweet rice flour', 'glutinous rice flour'],
    144.0,
);
export const allHardCodedIngredients = [
  butter,
  Flour,
  Parmesan_cheese,
  Honey,
  Sugar,
  Dried_Basil,
  Brown_sugar,
  Mochiko_Flour,
  Evaporated_milk,
  Yeast,
  Cumin,
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
  Parm_reg,
];

// https://www.aqua-calc.com/calculate/food-volume-to-weight
const shortIngredients = [
  'mayonnaise 220.0',
  'sour cream 230.0',
  'lemon juice 248.0',
  'lime juice 248.0',
  'pepper 110.4',
  'garlic 136.0',
  'chicken 148.8',
  'grapes 92.0',
  'pecans 112.0',
  'onion powder 110.4',
  'corn starch 128.0',
  'celery 120.0 ',
  'onion 115.2',
  'sake 232.8',
  'wine 232',
  'cocoa powder 86.0',
  'vanilla 208.0',
  'vanilla extract 208.0',
  'dark chocolate 259.88',
  'egg 0.0',
  'egg white 0.0',
  'cream cheese 348.0',
  'cake flour 137.0',
  'egg yolk 0.0',
  'ground turkey 120.0',
  'turkey sausage 12.5',
  'white beans 28.0',
];

export function parseShortIngredient(shortIngredient) {
  const words = shortIngredient.split(' ');
  const gramsPerCupString = words[words.length - 1];
  const gramsPerCupStringStart = shortIngredient.indexOf(gramsPerCupString);
  const nameString = shortIngredient.substring(0, gramsPerCupStringStart - 1);
  return makeIngredientObject(
      [nameString, nameString + 's'],
      parseFloat(gramsPerCupString),
  );
}

for (const shortIngredient of shortIngredients) {
  allHardCodedIngredients.push(parseShortIngredient(shortIngredient));
}
