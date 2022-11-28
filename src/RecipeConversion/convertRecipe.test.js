import { render, screen } from "@testing-library/react";
import { convertLine } from "./convertRecipe";

test("converts values to cups", () => {
  const testCases = [
    ["- 2.5 cups flour", "- 2.5000 cups flour"],
    ["- 1 tsp salt", "- 0.0208 cups salt"],
    ["- Two Tbsp sugar ", "- 0.1250 cups sugar "],
    ["- 2 cups butter ", "- 2.0000 cups butter "],
    ["- 1/4 cup water", "- 0.2500 cups water"],
    ["- 1/4 cup vodka ", "- 0.2500 cups vodka "],
    ["- 2 1/4 cup rum", "- 2.2500 cups rum"],
    ["- 2 1/4 cup grease", "- 2.2500 cups grease"],
    ["3/16 Tbsp Beer", "0.0117 cups Beer"],
    ["3 1/4 cup tequila", "3.2500 cups tequila"],
  ];

  for (const testCase of testCases) {
    //   console.log("testing " + testCase[0]);
    const result = convertLine(testCase[0]);
    expect(result).toEqual(testCase[1]);
  }
});
