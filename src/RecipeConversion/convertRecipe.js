import {
  wordsToNumbers,
  fractionsToDecimals,
  sanitizePunctuation,
  removeSpacesBeforePunctuation,
} from "./utilities/numberConversion";

/** ***************************** */
/*    Public Function        */
/** ***************************** */

/**
 * @param {string} ingredientListStringIn
 */
export function convertRecipe(ingredientListStringIn, recipeStringIn) {
  const ingredientsString = parseIngredientList(ingredientListStringIn);
  const recipeString = parseRecipe(recipeStringIn);
  const ingredientsHeader = "=============\n===Ingredients===\n=============\n";
  const recipeHeader = "\n\n=============\n====Recipe=====\n=============\n";
  return ingredientsHeader + ingredientsString + recipeHeader + recipeString;
}

/** ***************************** */
/*    General Helpers      */
/** ***************************** */

function strInsert(baseString, insertionString, index) {
  return (
    baseString.substring(0, index) +
    insertionString +
    baseString.substring(index)
  );
}

const NEW_LINE_MARKER = "#$%^";

function insertNewLinesAround(recipeString, ingredientString, startIndex) {
  const lineStarter = " - ";
  const ingredientStart = recipeString.indexOf(ingredientString, startIndex);
  var newRecipe = strInsert(
    recipeString,
    "\n" + NEW_LINE_MARKER + lineStarter,
    ingredientStart
  );
  const ingredientEnd =
    ingredientStart +
    ingredientString.length +
    NEW_LINE_MARKER.length +
    lineStarter.length +
    1;
  newRecipe = strInsert(newRecipe, "\n" + NEW_LINE_MARKER, ingredientEnd);
  return [newRecipe, ingredientEnd];
}

function putIngredientsOnOwnLine(recipeStringIn) {
  var recipe = recipeStringIn;
  var words = recipe.split(" ");
  // check each word if it's start of an ingredient
  var testString = "";
  var startIndex = 0;
  // TODO: handle case where false positive of ingredient word and need to backtrack to the next word
  // e.g. we have ingredients "unbleached flour" and "milk"
  // And text contains "unbleached milk". must still find milk
  for (
    var startWordIndex = 0;
    startWordIndex < words.length;
    startWordIndex++
  ) {
    const startWord = words[startWordIndex];
    testString = startWord;
    var word = startWord;
    var innerIndex = startWordIndex + 1;
    var ingredientFound = "";
    while (isIngredientWord(word)) {
      if (isIngredientName(testString)) {
        ingredientFound = testString;
      } else if (innerIndex >= words.length) {
        break;
      }
      word = words[innerIndex++];
      testString += " " + word;
    }
    if (ingredientFound != "") {
      [recipe, startIndex] = insertNewLinesAround(
        recipe,
        ingredientFound,
        startIndex
      );
    }
  }

  // If testWord is start of an ingredient put a new line before it and after it
  //
  return recipe;
}

function isSimpleWord(word) {
  return word.length == 0 || word == "and" || word == ",";
}

function isSimpleLine(lineIn) {
  const words = lineIn.split(" ");
  for (const word of words) {
    if (!isSimpleWord(word)) {
      return false;
    }
  }
  return lineIn.length < 6;
}

function removeSimpleLines(recipeStringIn) {
  const lines = recipeStringIn.split("\n");
  var finalLines = [];
  for (const line of lines) {
    var finalLine = line;
    if (line.indexOf(NEW_LINE_MARKER) != -1) {
      finalLine = line.replace(NEW_LINE_MARKER, "");
      if (isSimpleLine(finalLine)) {
        continue;
      }
    }
    finalLines.push(finalLine);
  }
  return finalLines.join("\n");
}

export function parseRecipe(recipeStringIn) {
  var recipe = recipeStringIn.replaceAll(".", "\n");
  var recipe = recipe.replaceAll(",", " ,");
  var recipe = recipe.replaceAll("\n", " \n");

  recipe = putIngredientsOnOwnLine(recipe);
  recipe = removeSimpleLines(recipe);
  return recipe;
}

function parseIngredientList(ingredientListStringIn) {
  const lines = ingredientListStringIn.split("\n");
  const newLines = lines.map(convertLine);
  return newLines.join("\n");
}

function stringContains(haystack, needle) {
  return haystack.indexOf(needle) != -1;
}

function stringContainsWord(haystack, needle) {
  const index = haystack.indexOf(needle);
  const endIndex = index + needle.length;
  return (
    index != -1 && (endIndex >= haystack.length || haystack[endIndex] == " ")
  );
}

/** ***************************** */
/*    Data & Data Structure      */
/** ***************************** */

class Ingredient {
  constructor(names, gramsPerCup) {
    this.names = names;
    this.gramsPerCup = gramsPerCup;
  }
}

class VolumeMeasure {
  /**
   * @param {string[]} names
   * @param {number} ratioToCup
   */
  constructor(names, ratioToCup) {
    this.names = names;
    this.ratioToCup = ratioToCup;
  }
}

/** ***************************** */
/*    Volume type & Ingredient lists      */
/** ***************************** */

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

function isIngredientWord(str) {
  return allIngredientWords.includes(str.toLocaleLowerCase());
}

function isIngredientName(strIn) {
  var str = strIn;
  if (str[str.length - 1] == " ") {
    str = str.substring(0, str.length - 1);
  }
  return allIngredientNameStrings.includes(str.toLocaleLowerCase());
}

const cupMeasure = new VolumeMeasure(["cup"], 1.0);
const teaspoonMeasure = new VolumeMeasure(["tsp", "teaspoon"], 0.0208333);
const tablespoonMeasure = new VolumeMeasure(
  ["tbsp", "tablespoon"],
  0.062499920209125003
);

const allVolumeMeasurements = [cupMeasure, teaspoonMeasure, tablespoonMeasure];

var allVolumeNameStrings = allVolumeMeasurements.flatMap((m) => m.names);
allVolumeNameStrings = allVolumeNameStrings.flatMap((str) => [str, str + "s"]);

var nameToVolume = {};
for (const volume of allVolumeMeasurements) {
  for (const name of volume.names) {
    nameToVolume[name] = volume;
    nameToVolume[name + "s"] = volume;
  }
}
// console.log(nameToVolume);

/** ***************************** */
/*    Parsing Helpers       */
/** ***************************** */

function containsVolumeMeasurement(line) {
  const lowerLine = line.toLocaleLowerCase();
  for (const str of allVolumeNameStrings) {
    if (stringContainsWord(lowerLine, str)) {
      return true;
    }
  }
  return false;
}

function findVolumeString(line) {
  const lowerLine = line.toLocaleLowerCase();
  var volumeNamePos = -1;
  var volumeTypeString = "";
  var volumeType = null;
  for (const str of allVolumeNameStrings) {
    if (stringContainsWord(lowerLine, str)) {
      // console.log("found match " + str + " in " + line);
      volumeNamePos = lowerLine.indexOf(str);
      volumeType = nameToVolume[str];
      volumeTypeString = str;
      break;
    }
  }
  const volumeStringEndIndex = volumeNamePos + volumeTypeString.length;
  const allowedNumberChars = "0123456789./ ";
  // Step back from start of name string to find last non-number char\
  var testIndex = volumeNamePos - 1;
  while (
    testIndex >= 0 &&
    stringContains(allowedNumberChars, lowerLine[testIndex])
  ) {
    testIndex--;
  }
  // Step forward to last actually valid char
  if (!stringContains(allowedNumberChars, lowerLine[testIndex])) {
    testIndex++;
  }
  // Step forward past any whitespace
  while (lowerLine[testIndex] == " ") {
    testIndex++;
  }
  // testIndex is now start of number sequence
  const volumeStringStartIndex = testIndex;
  const numberString = line.substring(testIndex, volumeNamePos);
  const volumeAmount = parseFloat(numberString);
  const volumeInCups = volumeAmount * volumeType.ratioToCup;
  // console.log(
  //   "result for line " +
  //     line +
  //     " ; start " +
  //     volumeStringStartIndex +
  //     " end " +
  //     volumeStringEndIndex
  // );
  return [volumeStringStartIndex, volumeInCups, volumeStringEndIndex];
}

function findIngredientName(lineIn, volumeStringEndIndex) {
  const words = lineIn
    .toLocaleLowerCase()
    .substring(volumeStringEndIndex + 1)
    .split(" ");
  var wordIndex = 0;
  var testWord = words[wordIndex++];
  // Skip any non-ingredient words
  while (!isIngredientWord(testWord) && wordIndex < words.length) {
    testWord = words[wordIndex++];
  }
  while (!isIngredientName(testWord) && wordIndex < words.length) {
    testWord += " " + words[wordIndex++];
  }
  if (!isIngredientName(testWord)) {
    console.log('Error: unknown ingredient "' + testWord + '"');
    return "";
  }
  return testWord;
}

/**
 * @param {string} lineIn
 */
export function convertLine(lineIn) {
  //  ------- Pre Processing ------------ //
  var newLine = wordsToNumbers(lineIn);
  newLine = fractionsToDecimals(newLine);
  newLine = sanitizePunctuation(newLine);

  if (!containsVolumeMeasurement(newLine)) {
    return lineIn;
  }

  //  ------- Finding Volume Amount ------------ //

  const [volumeStringStartIndex, volumeInCups, volumeStringEndIndex] =
    findVolumeString(newLine);

  //  ------- Finding Ingredient Name  ------------ //

  const ingredientName = findIngredientName(newLine, volumeStringEndIndex);
  if (ingredientName == "") {
    return lineIn;
  }
  const ingredient = nameToIngredient[ingredientName];

  //  ------- Conversion & String Building ------------ //

  const gramsAmount = ingredient.gramsPerCup * volumeInCups;
  const oldVolumeMeasurement = newLine.substring(
    volumeStringStartIndex,
    volumeStringEndIndex
  );
  const prefix = newLine.substring(0, volumeStringStartIndex);
  const suffix = newLine.substring(volumeStringEndIndex);

  var finalString =
    prefix +
    gramsAmount.toFixed(1) +
    "g (" +
    oldVolumeMeasurement +
    ") " +
    suffix;

  //  ------- Post Processing ------------ //
  finalString = removeSpacesBeforePunctuation(finalString);
  return finalString;
}
