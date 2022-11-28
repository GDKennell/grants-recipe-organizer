import { render, screen } from "@testing-library/react";
import { convertLine } from "./convertRecipe";

const testCases = [
  ["- 2.5 cups flour", "- 2.5000 cups flour"],
  ["- 1 tsp salt", "- 0.0208 cups salt"],
  ["- Two Tbsp sugar ", "- 0.1250 cups sugar "],
  ["- 2 cups butter ", "- 2.0000 cups butter "],
  ["- 1/4 cup water", "- 0.2500 cups water"],
  ["- 1/4 cup vodka ", "- 0.2500 cups vodka"],
];

for (const testCase of testCases) {
  console.log("testing " + testCase[0]);
  const result = convertLine(testCase[0]);
  expect(result).toEqual(testCase[1]);
}
