import { stringContainsWord, stringContains } from "../utilities/stringHelpers";
import {
  findVolumeByName,
  getAllVolumeNameStrings,
} from "../DataStructures/volumeMeasures";

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
