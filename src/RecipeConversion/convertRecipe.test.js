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

test("handles modifiers to ingredients and extraneous notes", () => {
  const testCases = [
    ["2 1/2 cups (12 1/2 ounces) unbleached all-purpose flour", ""],
    ["1 teaspoon table salt", ""],
    ["2 tablespoons sugar", ""],
    [
      "12 tablespoons (1 1/2 sticks) cold unsalted butter, cut into 1/4-inch slices",
      "",
    ],
    ["1/2 cup cold vegetable shortening, cut into small bits", ""],
    ["1/4 cup cold vodka", ""],
    ["1/4 cup  cold water", ""],
  ];
  /**
 * 312.5g (2.50 cups)  flour
6.0g (1 teaspoon)  salt
24.7g (2 tablespoons)  sugar
170.2g (12 tablespoons)  butter , cut into 0.25-inch slices
102.5g (0.50 cup)  shortening , cut into small bits
56.0g (0.25 cup)  vodka
59.1g (0.25 cup)  wate
 */
  for (const testCase of testCases) {
    //   console.log("testing " + testCase[0]);
    const result = convertLine(testCase[0]);
    expect(result).toEqual(testCase[1]);
  }
});
