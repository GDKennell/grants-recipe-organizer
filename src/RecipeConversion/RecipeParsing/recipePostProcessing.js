import {
  isSimpleLine,
  NEW_LINE_MARKER,
  removeTrailingWhitespace,
} from '../utilities/stringHelpers';

export function removeSimpleLines(recipeStringIn) {
  const lines = recipeStringIn.split('\n');
  const finalLines = [];
  for (const line of lines) {
    let finalLine = line;
    if (line.indexOf(NEW_LINE_MARKER) != -1) {
      finalLine = line.replace(NEW_LINE_MARKER, '');
      if (isSimpleLine(finalLine)) {
        continue;
      }
    }
    finalLines.push(finalLine);
  }
  const result = finalLines.join('\n');
  return removeTrailingWhitespace(result);
}
