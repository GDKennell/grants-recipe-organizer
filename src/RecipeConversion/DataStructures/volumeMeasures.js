import { stringContainsWord } from "../utilities/stringHelpers";

export class VolumeMeasure {
  /**
   * @param {string[]} names
   * @param {number} ratioToCup
   */
  constructor(names, ratioToCup) {
    this.names = names;
    this.ratioToCup = ratioToCup;
  }
}

export function containsVolumeMeasurement(line) {
  const lowerLine = line.toLocaleLowerCase();
  for (const str of allVolumeNameStrings) {
    if (stringContainsWord(lowerLine, str)) {
      return true;
    }
  }
  return false;
}

export function findVolumeByName(name) {
  return nameToVolume[name];
}

export function getAllVolumeNameStrings() {
  return allVolumeNameStrings;
}

const cupMeasure = new VolumeMeasure(["cup"], 1.0);
const teaspoonMeasure = new VolumeMeasure(["tsp", "teaspoon"], 0.0208333);
const tablespoonMeasure = new VolumeMeasure(
  ["tbsp", "tablespoon"],
  0.062499920209125003
);
const pintMeasure = new VolumeMeasure(["pint", "pt"], 2.0);

const allVolumeMeasurements = [
  cupMeasure,
  teaspoonMeasure,
  tablespoonMeasure,
  pintMeasure,
];

var allVolumeNameStrings = allVolumeMeasurements.flatMap((m) => m.names);
allVolumeNameStrings = allVolumeNameStrings.flatMap((str) => [str, str + "s"]);

var nameToVolume = {};
for (const volume of allVolumeMeasurements) {
  for (const name of volume.names) {
    nameToVolume[name] = volume;
    nameToVolume[name + "s"] = volume;
  }
}
