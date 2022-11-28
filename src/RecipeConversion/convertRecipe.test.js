import { render, screen } from "@testing-library/react";
import { convertLine } from "./convertRecipe";

test("converts values to cups", () => {
  const testCases = [
    ["- 2.5 cups flour", "- 312.5g (2.5 cups)  flour"],
    ["- 1 tsp salt", "- 6.0g (1 tsp)  salt"],
    ["- Two Tbsp sugar ", "- 24.7g (2 Tbsp)  sugar "],
    ["- 2 cups butter ", "- 454.0g (2 cups)  butter "],
    ["- 1/4 cup water", "- 59.1g (0.25 cup)  water"],
    ["- 1/4 cup vodka ", "- 56.0g (0.25 cup)  vodka "],
    ["- 2 1/4 cup rum", "- 504.0g (2.25 cup)  rum"],
    ["- 2 1/4 cups shortening", "- 461.3g (2.25 cups)  shortening"],
    ["3/16 tablespoons Beer", "2.8g (0.19 tablespoons)  Beer"],
    ["3 1/4 cup tequila", "728.0g (3.25 cup)  tequila"],
  ];

  for (const testCase of testCases) {
    //   console.log("testing " + testCase[0]);
    const result = convertLine(testCase[0]);
    expect(result).toEqual(testCase[1]);
  }
});
