import {
  stringContainsWord,
  stringContains,
  wordBefore,
} from "../utilities/stringHelpers";
import {
  findVolumeByName,
  getAllVolumeNameStrings,
} from "../DataStructures/unitMeasure";

export function findVolumeStringBefore(
  recipeString,
  ingredientString,
  startIndex
) {
  // Find Volume Name
  const ingredientStart = recipeString.indexOf(ingredientString, startIndex);
  const [volumeString, volumeStringStart] = wordBefore(
    recipeString,
    ingredientStart
  );
  const volume = findVolumeByName(volumeString);
  if (volume == undefined) {
    return ["", null, -1.0];
  }

  const [numberString, numberStringStartIndex] = findVolumeQuantityBefore(
    recipeString,
    volumeStringStart - 1
  );
  if (isNaN(parseFloat(numberString))) {
    // No number before volume marker, so assuming 1
    // e.g. "and a cup water"
    return [volumeString, volume, 1.0];
  }
  const fullVolumeString = numberString + " " + volumeString;
  const quantity = parseFloat(numberString);
  return [fullVolumeString, volume, quantity];
}

function findVolumeQuantityBefore(line, startCharIndex) {
  const allowedNumberChars = "0123456789./ ";
  // Step back from start of name string to find last non-number char\
  var testIndex = startCharIndex - 1;
  while (
    testIndex >= 0 &&
    stringContains(allowedNumberChars, line[testIndex])
  ) {
    testIndex--;
  }
  // Step forward to last actually valid char
  if (!stringContains(allowedNumberChars, line[testIndex])) {
    testIndex++;
  }
  // Step forward past any whitespace
  while (line[testIndex] == " ") {
    testIndex++;
  }
  const numberString = line.substring(testIndex, startCharIndex);
  return [numberString, testIndex];
}

export function findVolumeString(line) {
  const lowerLine = line.toLocaleLowerCase();
  var volumeNamePos = -1;
  var volumeTypeString = "";
  var volumeType = null;
  for (const str of getAllVolumeNameStrings()) {
    if (stringContainsWord(lowerLine, str)) {
      // console.log("found match " + str + " in " + line);
      volumeNamePos = lowerLine.indexOf(str);
      volumeType = findVolumeByName(str);
      volumeTypeString = str;
      break;
    }
  }
  const volumeStringEndIndex = volumeNamePos + volumeTypeString.length;

  const [numberString, numberStringStartIndex] = findVolumeQuantityBefore(
    lowerLine,
    volumeNamePos - 1
  );

  // testIndex is now start of number sequence
  const volumeStringStartIndex = numberStringStartIndex;
  const volumeAmount = parseFloat(numberString);
  const volumeInCups = volumeAmount * volumeType.ratioToCup;

  return [volumeStringStartIndex, volumeInCups, volumeStringEndIndex];
}
