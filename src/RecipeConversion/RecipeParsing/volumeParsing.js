import {
  stringContainsWord,
  wordBefore,
  isValidNumberString,
} from '../utilities/stringHelpers';
import {
  findCountableUnitByName,
  findVolumeByName,
  findWeightByName,
  genericUnitMeasure,
  getAllCountableUnitNameStrings,
  getAllVolumeNameStrings,
  getAllWeightNameStrings,
  UnitQuantity,
} from '../DataStructures/unitMeasure';

export function findVolumeStringBefore(
    recipeString,
    ingredientString,
    startIndex,
) {
  // Find Volume Name
  const ingredientStart = recipeString.indexOf(ingredientString, startIndex);
  const [volumeString, volumeStringStart] = wordBefore(
      recipeString,
      ingredientStart,
  );
  const volume = findVolumeByName(volumeString);
  if (volume == undefined) {
    return ['', null, -1.0];
  }

  const [numberString] = findUnitQuantityBefore(
      recipeString,
      volumeStringStart - 1,
  );
  if (isNaN(parseFloat(numberString))) {
    // No number before volume marker, so assuming 1
    // e.g. "and a cup water"
    return [volumeString, volume, 1.0];
  }
  const fullVolumeString = numberString + ' ' + volumeString;
  const quantity = parseFloat(numberString);
  return [fullVolumeString, volume, quantity];
}

function findUnitQuantityBefore(line, startCharIndex) {
  const searchString = line.substr(0, startCharIndex );
  const words = searchString.split(' ').reverse();

  for (const word of words) {
    if (isValidNumberString(word)) {
      const location = line.indexOf(word);
      return [word, location];
    }
  }
  return ['', -1];
}

export function findUnitMeasureString(line) {
  let unitStringStartIndex = -1;
  let unitQuantity = null;
  let unitStringendIndex = -1;

  const unitTypeFinders = [
    findCountableUnitString,
    findVolumeString,
    findWeightString,
    findUnitQuantityString];
  for (const unitTypeFinder of unitTypeFinders) {
    [unitStringStartIndex, unitQuantity, unitStringendIndex] =
      unitTypeFinder(line);
    if (unitQuantity) {
      break;
    }
  }

  return [
    unitStringStartIndex,
    unitQuantity,
    unitStringendIndex,
  ];
}

function findUnitQuantityString(line) {
  const words = line.split(' ');
  for (const word of words) {
    if (!isNaN(parseFloat(word))) {
      const quantity = parseFloat(word);
      const numberStartIndex = line.indexOf(word);
      const numberEndIndex = numberStartIndex + word.length;
      const unitQuantity = new UnitQuantity(genericUnitMeasure, quantity);
      return [numberStartIndex, unitQuantity, numberEndIndex];
    }
  }
  return [-1, null, -1];
}

export function findWeightString(line) {
  const [unitStringStartIndex, unitAmount, unitType, unitStringEndIndex] =
    findGenericUnitMeasureString(
        line,
        findWeightByName,
        getAllWeightNameStrings,
    );
  const unitQuantity = unitType ? new UnitQuantity(unitType, unitAmount) : null;
  return [unitStringStartIndex, unitQuantity, unitStringEndIndex];
}

export function findVolumeString(line) {
  const [unitStringStartIndex, unitAmount, unitType, unitStringEndIndex] =
    findGenericUnitMeasureString(
        line,
        findVolumeByName,
        getAllVolumeNameStrings,
    );
  const unitQuantity = unitType ? new UnitQuantity(unitType, unitAmount) : null;
  return [unitStringStartIndex, unitQuantity, unitStringEndIndex];
}

export function findCountableUnitString(line) {
  const [unitStringStartIndex, unitAmount, unitType, unitStringEndIndex] =
  findGenericUnitMeasureString(
      line,
      findCountableUnitByName,
      getAllCountableUnitNameStrings,
  );
  const unitQuantity = unitType ? new UnitQuantity(unitType, unitAmount) : null;
  return [unitStringStartIndex, unitQuantity, unitStringEndIndex];
}

function specialCaseSkipUnitWord(word, lineIn) {
  const words = lineIn
      .toLocaleLowerCase()
      .split(' ');

  if ((word == 'clove' || word == 'cloves') && !words.includes('garlic')) {
    return true;
  }
  return false;
}

export function findGenericUnitMeasureString(
    line,
    findByNameFn,
    getAllStringsFn,
) {
  const lowerLine = line.toLocaleLowerCase();
  let unitNamePos = -1;
  let unitTypeString = '';
  let unitType = null;
  for (const str of getAllStringsFn()) {
    if (stringContainsWord(lowerLine, str) && !specialCaseSkipUnitWord(str, line)) {
      unitNamePos = lowerLine.indexOf(str);
      unitType = findByNameFn(str);
      unitTypeString = str;
      break;
    }
  }
  if (unitType == null) {
    return [-1, -1, null, -1];
  }
  const unitStringEndIndex = unitNamePos + unitTypeString.length;

  const [numberString, numberStringStartIndex] = findUnitQuantityBefore(
      lowerLine,
      unitNamePos - 1,
  );

  // testIndex is now start of number sequence
  const unitStringStartIndex = numberStringStartIndex;
  const unitAmount = parseFloat(numberString);

  return [unitStringStartIndex, unitAmount, unitType, unitStringEndIndex];
}
