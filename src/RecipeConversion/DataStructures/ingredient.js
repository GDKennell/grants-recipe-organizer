import {collection, addDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';


export class Ingredient {
  constructor(names, gramsPerCup) {
    this.names = names;
    this.gramsPerCup = gramsPerCup;
  }
}

export function isIngredientWord(str) {
  if (str == undefined || str == '') {
    return false;
  }
  return allIngredientWords.includes(str.toLocaleLowerCase());
}

export function isIngredientName(strIn) {
  let str = strIn;
  if (str[str.length - 1] == ' ') {
    str = str.substring(0, str.length - 1);
  }
  return allIngredientNameStrings.includes(str.toLocaleLowerCase());
}

export function findIngredientByName(ingredientName) {
  return nameToIngredient[ingredientName];
}

const butter = new Ingredient(
    ['butter', 'unsalted butter', 'salted butter', 'melted butter'],
    227.0,
);

const Flour = new Ingredient(
    ['Flour', 'All purpose flour', 'all-purpose flour'],
    125.0,
);
const Parmesan_cheese = new Ingredient(['Parmesan cheese'], 100.0);
const Honey = new Ingredient(['Honey'], 337.6);
const Sugar = new Ingredient(['Sugar', 'Granulated sugar'], 198.0);
const Dried_Basil = new Ingredient(['Dried Basil', 'basil'], 72.0);
const Brown_sugar = new Ingredient(['Brown sugar'], 192.0);
const Evaporated_milk = new Ingredient(['Evaporated milk'], 252.0);
const Yeast = new Ingredient(['Yeast', 'active dry yeast'], 192.0);
const Water = new Ingredient(['Water'], 236.6);
const Poppy_seeds = new Ingredient(['Poppy seeds'], 140.8);
const Sesame_seeds = new Ingredient(['Sesame seeds'], 245.0);
const Salt = new Ingredient(['Salt', 'Sea Salt', 'seasalt'], 288.0);
const Yogurt = new Ingredient(['Yogurt'], 245.0);
const Olive_oil = new Ingredient(
    ['Olive oil', 'oil', 'canola oil', 'vegetable oil', 'peanut oil'],
    216.0,
);
const Five_Spice_mix = new Ingredient(
    ['5 Spice mix', 'Five Spice Mix', 'Five Spice'],
    120.0,
);
const Soy_Sauce = new Ingredient(['Soy Sauce'], 248.0);
const Shaoxing_Wine = new Ingredient(['Shaoxing Wine'], 236.0);
const Garlic_powder = new Ingredient(['Garlic powder'], 155.2);
const Black_pepper = new Ingredient(['Black pepper'], 110.0);
const Baking_powder = new Ingredient(['Baking powder'], 220.8);
const Baking_soda = new Ingredient(['Baking soda'], 220.8);
const Thyme = new Ingredient(['Thyme'], 68.8);
const Milk = new Ingredient(['Milk'], 244.0); // 2%
const Heavy_cream = new Ingredient(['Heavy cream', 'cream'], 238.0);
const Monterey_Jack_cheese = new Ingredient(['Monterey Jack cheese'], 112.0);
const Cottage_cheese = new Ingredient(['Cottage cheese'], 226.0);
const Cajun_seasoning = new Ingredient(['Cajun seasoning'], 172.0);
const Oregano = new Ingredient(['Oregano'], 86.4);
const Cornstarch = new Ingredient(['Cornstarch'], 128.0);
const Walnuts = new Ingredient(['Walnuts'], 120.0);
const Cinnamon = new Ingredient(['Cinnamon'], 124.8);
const Ginger = new Ingredient(['Ginger'], 83.2);
const Nutmeg = new Ingredient(['Nutmeg'], 112.0);
const Cumin = new Ingredient(
    ['cumin', 'ground cumin', 'ground cumin seed'],
    96,
);
const Cloves = new Ingredient(['Cloves'], 104.0); // ground
const Onion_salt = new Ingredient(['Onion salt'], 225.6);
const Paprika = new Ingredient(['Paprika'], 108.8);
const Chili_powder = new Ingredient(['Chili powder'], 128.0);
const Vanilla_Extract = new Ingredient(['Vanilla Extract'], 208.0);
const Vinegar = new Ingredient(['Vinegar', 'white vinegar'], 238.0); // Distilled white
const Vodka = new Ingredient(
    ['Vodka', 'rum', 'whiskey', 'gin', 'tequila'],
    224.0,
);
const Shortening = new Ingredient(['Shortening'], 205.0);
const Beer = new Ingredient(['Beer'], 236.0);
const Cream_Of_Tartar = new Ingredient(['Cream of tartar'], 144.0);
const Mochiko_Flour = new Ingredient(
    ['Mochiko', 'Mochiko Flour', 'sweet rice flour', 'glutinous rice flour'],
    144.0,
);
const allIngredients = [
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
];

export function parseShortIngredient(shortIngredient) {
  const words = shortIngredient.split(' ');
  const gramsPerCupString = words[words.length - 1];
  const gramsPerCupStringStart = shortIngredient.indexOf(gramsPerCupString);
  const nameString = shortIngredient.substring(0, gramsPerCupStringStart - 1);
  return new Ingredient(
      [nameString, nameString + 's'],
      parseFloat(gramsPerCupString),
  );
}

for (const shortIngredient of shortIngredients) {
  allIngredients.push(parseShortIngredient(shortIngredient));
}

const allIngredientNameStrings = allIngredients
    .flatMap((m) => m.names)
    .map((m) => m.toLocaleLowerCase());
const allIngredientWords = allIngredientNameStrings.flatMap((m) =>
  m.toLocaleLowerCase().split(' '),
);

const nameToIngredient = {};
for (const ingredient of allIngredients) {
  for (const name of ingredient.names) {
    nameToIngredient[name.toLocaleLowerCase()] = ingredient;
  }
}

async function storeIngredientToDb(ingredient, db) {
  try {
    await addDoc(collection(db, 'ingredients'), {
      names: ingredient.names,
      gramsPerCupt: ingredient.gramsPerCup,
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}
async function deleteIngredient(db, id) {
  await deleteDoc(doc(db, 'ingredients', id));
}
export async function writeToDb(db) {
  const allDbNames = [];
  let numDocs = 0;
  console.log('here we go');
  try {
    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    querySnapshot.forEach((doc) => {
      if (doc.data().names != undefined ) {
        numDocs ++;
        doc.data().names.forEach((name) => {
          allDbNames.push(name);
        });
      } else {
        console.log(`Got a bad doc with id ${doc.id}`);
        deleteIngredient(db, doc.id);
      }
    });
    console.log(allDbNames);
    console.log(`have ${numDocs } docs`);
    allIngredients.forEach((ingredient) => {
      if (!allDbNames.includes(ingredient.names[0])) {
        storeIngredientToDb(ingredient, db);
      }
    });
  } catch (e) {
    console.error('Error reading documents: ', e);
  }
}
