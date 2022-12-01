import { stringContainsWord } from "../utilities/stringHelpers";

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

  isVolumeMeasure() {
    return this.ratioToCup != null;
  }

  isWeightMeasure() {
    return this.ratioToGram != null;
  }

  isUnitMeasure() {
    return !this.isVolumeMeasure() && !this.isWeightMeasure();
  }
}

export function containsUnitMeasurement(line) {
  const lowerLine = line.toLocaleLowerCase();
  for (const str of allVolumeNameStrings) {
    if (stringContainsWord(lowerLine, str)) {
      return true;
    }
  }
  return false;
}

export function findVolumeByName(name) {
  return nameToVolume[name.toLocaleLowerCase()];
}

export function getAllVolumeNameStrings() {
  return allVolumeNameStrings;
}

const cupMeasure = new UnitMeasure(["cup"], 1.0, null);
const teaspoonMeasure = new UnitMeasure(["tsp", "teaspoon"], 0.0208333, null);
const tablespoonMeasure = new UnitMeasure(
  ["tbsp", "tablespoon", "tb"],
  0.062499920209125003,
  null
);
const pintMeasure = new UnitMeasure(["pint", "pt"], 2.0, null);
const fluidOunceMeasure = new UnitMeasure(
  ["fl. oz.", "fl oz", "fluid ounce", "oz"],
  0.125,
  null
);

const gramMeasure = new UnitMeasure(["g", "gram"], null, 1.0);
const poundMeasure = new UnitMeasure(["lb", "pound"], null, 453.5924);
const kiloMeasure = new UnitMeasure(["kg", "kilo", "kilogram"], null, 1000.0);

const allUnitMeasurements = [
  cupMeasure,
  teaspoonMeasure,
  tablespoonMeasure,
  pintMeasure,
  fluidOunceMeasure,
  gramMeasure,
  poundMeasure,
  kiloMeasure,
];

var allVolumeNameStrings = allUnitMeasurements.flatMap((m) => m.names);
allVolumeNameStrings = allVolumeNameStrings.flatMap((str) => [str, str + "s"]);

var nameToVolume = {};
for (const volume of allUnitMeasurements) {
  for (const name of volume.names) {
    nameToVolume[name] = volume;
    nameToVolume[name + "s"] = volume;
  }
}
