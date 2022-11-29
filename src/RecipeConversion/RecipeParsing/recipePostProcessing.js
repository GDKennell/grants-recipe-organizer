import { isSimpleLine, NEW_LINE_MARKER } from "../utilities/stringHelpers";

export function removeSimpleLines(recipeStringIn) {
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
