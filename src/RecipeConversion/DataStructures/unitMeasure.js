import {stringContainsWord} from '../utilities/stringHelpers';


export class UnitQuantity {
  constructor(unitMeasure, quantity) {
    this.unitMeasure = unitMeasure;
    this.quantity = quantity;
  }
  scaledBy(scaleFactor) {
    return new UnitQuantity(this.unitMeasure, this.quantity * scaleFactor);
  }
}


export class UnitMeasure {
  /**
   * @param {string[]} names
   * @param {number} ratioToCup
   *
   */
  constructor(names, ratioToCup, ratioToGram) {
    this.names = names;
    this.ratioToCup = ratioToCup;
    this.ratioToGram = ratioToGram;
  }

  get isVolumeMeasure() {
    return this.ratioToCup != null;
  }

  get isWeightMeasure() {
    return this.ratioToGram != null;
  }
  get isCountableUnitMeasure() {
    return !this.isVolumeMeasure && !this.isWeightMeasure && this.names != null;
  }

  get isUnitMeasure() {
    return !this.isVolumeMeasure && !this.isWeightMeasure;
  }
}

export const genericUnitMeasure = new UnitMeasure(/* names */ null,
/* ratioToCup*/ null,
    /* ratioToGram*/ null);

/** ***********************
 * Countable Unit Measures
 *************************/
const canMeasure = new UnitMeasure(['can'], null, null);
const cloveMeasure = new UnitMeasure(['clove'], null, null);
const stickMeasure = new UnitMeasure(['stick'], null, null);
const packageMeasure = new UnitMeasure(['package', 'pkg'], null, null);

const allCountableUnitMeasurements = [
  canMeasure,
  cloveMeasure,
  stickMeasure,
  packageMeasure,
];

let allCountableUnitNameStrings = allCountableUnitMeasurements.flatMap((m) => m.names);
allCountableUnitNameStrings = allCountableUnitNameStrings.flatMap((str) => [str, str + 's']);

const nameToCountableUnit = {};
for (const countableUnit of allCountableUnitMeasurements) {
  for (const name of countableUnit.names) {
    nameToCountableUnit[name] = countableUnit;
    nameToCountableUnit[name + 's'] = countableUnit;
  }
}


export function findCountableUnitByName(name) {
  return nameToCountableUnit[name.toLocaleLowerCase()];
}

export function getAllCountableUnitNameStrings() {
  return allCountableUnitNameStrings;
}

/** ***********************
 * Volume Measures
 *************************/
const cupMeasure = new UnitMeasure(['cup'], 1.0, null);
const teaspoonMeasure = new UnitMeasure(['tsp', 'teaspoon'], 0.0208333, null);
const tablespoonMeasure = new UnitMeasure(
    ['tbsp', 'tablespoon', 'tb'],
    0.062499920209125003,
    null,
);
const pintMeasure = new UnitMeasure(['pint', 'pt'], 2.0, null);
const fluidOunceMeasure = new UnitMeasure(
    ['fl. oz.', 'fl oz', 'fluid ounce'],
    0.125,
    null,
);

const allVolumeMeasurements = [
  cupMeasure,
  teaspoonMeasure,
  tablespoonMeasure,
  pintMeasure,
  fluidOunceMeasure,
];

let allVolumeNameStrings = allVolumeMeasurements.flatMap((m) => m.names);
allVolumeNameStrings = allVolumeNameStrings.flatMap((str) => [str, str + 's']);

const nameToVolume = {};
for (const volume of allVolumeMeasurements) {
  for (const name of volume.names) {
    nameToVolume[name] = volume;
    nameToVolume[name + 's'] = volume;
  }
}


export function findVolumeByName(name) {
  return nameToVolume[name.toLocaleLowerCase()];
}

export function getAllVolumeNameStrings() {
  return allVolumeNameStrings;
}

/** ***********************
 * Weight Measures
 *************************/

const gramMeasure = new UnitMeasure(['g', 'gram'], null, 1.0);
const poundMeasure = new UnitMeasure(['lb', 'pound'], null, 453.5924);
const kiloMeasure = new UnitMeasure(['kg', 'kilo', 'kilogram'], null, 1000.0);
const ounceMeasure = new UnitMeasure(['oz', 'ounce'], null, 28.3495);

const allWeightMeasurements = [
  gramMeasure,
  poundMeasure,
  kiloMeasure,
  ounceMeasure,
];

let allWeightNameStrings = allWeightMeasurements.flatMap((m) => m.names);
allWeightNameStrings = allWeightNameStrings.flatMap((str) => [str, str + 's']);

const nameToWeight = {};
for (const weight of allWeightMeasurements) {
  for (const name of weight.names) {
    nameToWeight[name] = weight;
    nameToWeight[name + 's'] = weight;
  }
}


export function findWeightByName(name) {
  return nameToWeight[name.toLocaleLowerCase()];
}

export function getAllWeightNameStrings() {
  return allWeightNameStrings;
}

/** ***********************
 * Generic Unit Measures
 *************************/
const allUnitMeasurements = [
  ...allCountableUnitMeasurements,
  ...allVolumeMeasurements,
  ...allWeightMeasurements,
];


let allUnitMeasureNameStrings = allUnitMeasurements.flatMap((m) => m.names);
allUnitMeasureNameStrings = allUnitMeasureNameStrings.flatMap((str) => [
  str,
  str + 's',
]);


export function containsUnitMeasurement(line) {
  const lowerLine = line.toLocaleLowerCase();
  for (const str of allUnitMeasureNameStrings) {
    if (stringContainsWord(lowerLine, str)) {
      return true;
    }
  }
  const words = line.split(' ');
  for (const word of words) {
    if (!isNaN(parseFloat(word))) {
      return true;
    }
  }
  return false;
}

