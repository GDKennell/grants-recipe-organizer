import { stringContainsWord } from "../utilities/stringHelpers";

export class UnitMeasure {
  /**
   * @param {string[]} names
   * @param {number} ratioToCup
   */
  constructor(names, ratioToCup) {
    this.names = names;
    this.ratioToCup = ratioToCup;
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

const cupMeasure = new UnitMeasure(["cup"], 1.0);
const teaspoonMeasure = new UnitMeasure(["tsp", "teaspoon"], 0.0208333);
const tablespoonMeasure = new UnitMeasure(
  ["tbsp", "tablespoon"],
  0.062499920209125003
);
const pintMeasure = new UnitMeasure(["pint", "pt"], 2.0);

const allUnitMeasurements = [
  cupMeasure,
  teaspoonMeasure,
  tablespoonMeasure,
  pintMeasure,
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
