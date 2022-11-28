/**
 * @param {string} recipeStringIn
 */
export function convertRecipe(recipeStringIn) {
  const lines = recipeStringIn.split("\n");
  const newLines = lines.map(convertLine);
  return newLines.join("\n");
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

const cupMeasure = new VolumeMeasure(["cup"], 1.0);
const teaspoonMeasure = new VolumeMeasure(["tsp", "teaspoon"], 0.0208333);
const tablespoonMeasure = new VolumeMeasure(
  ["tbsp", "tablespoon"],
  0.062499920209125003
);

const allVolumeMeasurements = [cupMeasure, teaspoonMeasure, tablespoonMeasure];

function containsVolumeMeasurement(line) {
  var allStrings = allVolumeMeasurements.flatMap((m) => m.names);
  allStrings = allStrings.flatMap((str) => [str, str + "s"]);
  for (const str of allStrings) {
    if (line.indexOf(str) != -1) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} lineIn
 */
function convertLine(lineIn) {
  if (!containsVolumeMeasurement(lineIn)) {
    return lineIn;
  }
  console.log("converting ", lineIn);
  return lineIn;
}
