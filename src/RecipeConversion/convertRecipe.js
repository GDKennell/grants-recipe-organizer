import { wordsToNumbers } from "./utilities/numberConversion";

/** ***************************** */
/*    Public Function        */
/** ***************************** */

/**
 * @param {string} recipeStringIn
 */
export function convertRecipe(recipeStringIn) {
  const lines = recipeStringIn.split("\n");
  const newLines = lines.map(convertLine);
  return newLines.join("\n");
}

/** ***************************** */
/*    General Helpers      */
/** ***************************** */
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

const cupMeasure = new VolumeMeasure(["cup"], 1.0);
const teaspoonMeasure = new VolumeMeasure(["tsp", "teaspoon"], 0.0208333);
const tablespoonMeasure = new VolumeMeasure(
  ["tbsp", "tablespoon"],
  0.062499920209125003
);

/** ***************************** */
/*    Volume type lists      */
/** ***************************** */

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
console.log(nameToVolume);

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
  return [volumeStringStartIndex, volumeInCups, volumeStringEndIndex];
}

function findIngredientName(lineIn, volumeStringEndIndex) {}

/**
 * @param {string} lineIn
 */
function convertLine(lineIn) {
  if (!containsVolumeMeasurement(lineIn)) {
    return lineIn;
  }
  console.log("converting ", lineIn);
  var newLine = wordsToNumbers(lineIn);
  const [volumeStringStartIndex, volumeInCups, volumeStringEndIndex] =
    findVolumeString(newLine);
  const cupsValueString = volumeInCups.toFixed(4) + " cups";
  const finalLine =
    lineIn.slice(0, volumeStringStartIndex) +
    cupsValueString +
    lineIn.slice(volumeStringEndIndex);
  // const ingredientName = findIngredientName(lineIn, volumeStringEndIndex)
  return finalLine;
}
