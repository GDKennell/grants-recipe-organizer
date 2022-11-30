import { render, screen } from "@testing-library/react";
import {
  convertRecipe,
  INGREDIENTS_HEADER,
  RECIPES_HEADER,
} from "./convertRecipe";
import { parseIngredientListLine } from "./RecipeParsing/ingredientParsing";
import { parseRecipe } from "./RecipeParsing/recipeParsing";

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
    const [result, ingredient] = parseIngredientListLine(testCase[0]);
    expect(result).toEqual(testCase[1]);
  }
});

test("handles modifiers to ingredients and extraneous notes", () => {
  const testCases = [
    [
      "2 1/2 cups (12 1/2 ounces) unbleached all-purpose flour",
      "312.5g (2.50 cups)  (12 1/2 ounces) unbleached all-purpose flour",
    ],
    ["1 teaspoon table salt", "6.0g (1 teaspoon)  table salt"],
    ["2 tablespoons sugar", "24.7g (2 tablespoons)  sugar"],
    [
      "12 tablespoons (1 1/2 sticks) cold unsalted butter, cut into 1/4-inch slices",
      "170.2g (12 tablespoons)  (1.50 sticks) cold unsalted butter, cut into 1/4-inch slices",
    ],
    [
      "1/2 cup cold vegetable shortening, cut into small bits",
      "102.5g (0.50 cup)  cold vegetable shortening, cut into small bits",
    ],
    ["1/4 cup cold vodka", "56.0g (0.25 cup)  cold vodka"],
    ["1/4 cup  cold water", "59.1g (0.25 cup)   cold water"],
  ];

  for (const testCase of testCases) {
    //   console.log("testing " + testCase[0]);
    const [result, ingredient] = parseIngredientListLine(testCase[0]);
    expect(result).toEqual(testCase[1]);
  }
});

test("cold water = water", () => {
  const [result, ingredient] = parseIngredientListLine("1/4 cup  cold water");
  expect(result).toEqual("59.1g (0.25 cup)   cold water");
});
test("handles unicode fractions", () => {
  const testCases = [
    [
      "1½ cups/180 grams all-purpose flour",
      "187.5g (1.50 cups) /180 grams all-purpose flour",
    ],
    ["1 teaspoon cream of tartar", "5.0g (1 teaspoon)  cream of tartar"],
    ["½ teaspoon baking soda", " 2.3g (0.50 teaspoon)  baking soda"],
    ["½ teaspoon kosher salt", " 3.0g (0.50 teaspoon)  kosher salt"],
    [
      "10 tablespoons/140 grams unsalted butter (1¼ sticks), at room temperature",
      "141.9g (10 tablespoons) /140 grams unsalted butter (1 1/4 sticks), at room temperature",
    ],
    [
      "¾ cup/150 grams granulated sugar, ",
      " 148.5g (0.75 cup) /150 grams granulated sugar, ",
    ],
    ["1 large egg", "1 large egg"],
    ["½ teaspoon vanilla extract", " 2.2g (0.50 teaspoon)  vanilla extract"],
    ["1 tablespoon ground cinnamon", "7.8g (1 tablespoon)  ground cinnamon"],
  ];

  for (const testCase of testCases) {
    //   console.log("testing " + testCase[0]);
    const [result, ingredient] = parseIngredientListLine(testCase[0]);
    expect(result).toEqual(testCase[1]);
  }
});

test("puts ingredients on new lines", () => {
  const prepSteps =
    "In the bowl of an electric mixer, beat together the butter and ¾ cup sugar until fluffy, about 2 minutes, scraping down the sides as necessary. Beat in the egg until creamy, and then add the vanilla, again scraping down the sides. Add the flour mixture to the butter mixture and beat on low until just combined.";

  const expected =
    "In the bowl of an electric mixer , beat together the \n - butter\n and  \n - 0.75 cup sugar\n until fluffy , about 2 minutes , scraping down the sides as necessary \n Beat in the egg until creamy , and then add the vanilla , again scraping down the sides \n Add the \n - flour\n mixture to the \n - butter\n mixture and beat on low until just combined";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("looks for longer ingredient if present", () => {
  const prepSteps =
    "Step 1\nHeat the oven to 375 degrees. In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt.\n\n";

  const expected =
    "Step 1 \nHeat the oven to 375 degrees \n In a medium bowl , whisk together the \n - flour\n - cream of tartar\n - baking soda\n - salt";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("salt stuff I guess", () => {
  const prepSteps =
    "In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt.";
  const expected =
    "In a medium bowl , whisk together the \n - flour\n - cream of tartar\n - baking soda\n - salt";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("Keeps measurement with ingredient in recipe", () => {
  const prepSteps =
    "In a small bowl, combine the remaining 2 tablespoons sugar and the cinnamon. Roll the dough into golf-ball-size balls, then roll each one in the cinnamon-sugar mixture";
  const expected =
    "In a small bowl , combine the remaining \n - 2 tablespoons sugar\n and the \n - cinnamon\n Roll the dough into golf-ball-size balls , then roll each one in the cinnamon-sugar mixture";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("chicken salad ingredients", () => {
  //https://www.tasteofhome.com/article/easy-chicken-salad/
  const ingredientList =
    "1/2 cup mayonnaise\n    2 tablespoons sour cream\n    1 tablespoon lemon juice\n    1/8 teaspoon salt\n    1/8 teaspoon pepper\n    4 cups shredded rotisserie chicken\n    1-1/4 cups seedless red grapes, halved\n    1/2 cup chopped pecans\n    1/2 cup chopped celery\n    1/4 cup chopped sweet onion, optional\n\n";
  const expectedIngredientList =
    "110.0g (0.50 cup)  mayonnaise\n    28.7g (2 tablespoons)  sour cream\n    15.5g (1 tablespoon)  lemon juice\n    0.8g (0.13 teaspoon)  salt\n    0.3g (0.13 teaspoon)  pepper\n    595.2g (4 cups)  shredded rotisserie chicken\n    115.0g (1.25 cups)  seedless red grapes, halved\n    56.0g (0.50 cup)  chopped pecans\n    1/2 cup chopped celery\n    28.8g (0.25 cup)  chopped sweet onion, optional";
  const result = convertRecipe(ingredientList, "");
  expect(result.indexOf(expectedIngredientList)).toBeGreaterThan(0);
});

test("Brings ingredient amounts from list to prep steps", () => {
  const ingredientList =
    "1½ cups/180 grams all-purpose flour\n1 teaspoon cream of tartar\n½ teaspoon baking soda\n½ teaspoon kosher salt\n\n";
  const prepSteps =
    "Step 1\nHeat the oven to 375 degrees. In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt";
  const ingredientsString =
    "187.5g (1.50 cups) /180 grams all-purpose flour\n5.0g (1 teaspoon)  cream of tartar\n 2.3g (0.50 teaspoon)  baking soda\n 3.0g (0.50 teaspoon)  kosher salt";
  const recipeString =
    "Step 1 \nHeat the oven to 375 degrees \n In a medium bowl , whisk together the \n - 187.50g (1.50 cups) flour\n - 4.96g (1 teaspoon) cream of tartar\n - 2.30g (0.50 teaspoon) baking soda\n - 3.00g (0.50 teaspoon) salt";
  const result = convertRecipe(ingredientList, prepSteps);
  expect(result.indexOf(ingredientsString)).toBeGreaterThan(0);
  expect(result.indexOf(recipeString)).toBeGreaterThan(0);
});

test("ingredients moved over and skip 'and'", () => {
  const ingredientList =
    "1½ cups/180 grams all-purpose flour\n1 teaspoon cream of tartar\n½ teaspoon baking soda\n½ teaspoon kosher salt\n10 tablespoons/140 grams unsalted butter (1¼ sticks), at room temperature\n¾ cup/150 grams granulated sugar, plus 2 tablespoons\n1 large egg\n½ teaspoon vanilla extract\n1 tablespoon ground cinnamon\n\n";
  const prepSteps =
    "Step 1\nHeat the oven to 375 degrees. In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt";
  const ingredientsString =
    "187.5g (1.50 cups) /180 grams all-purpose flour\n5.0g (1 teaspoon)  cream of tartar\n 2.3g (0.50 teaspoon)  baking soda\n 3.0g (0.50 teaspoon)  kosher salt";
  const recipeString =
    "Step 1 \nHeat the oven to 375 degrees \n In a medium bowl , whisk together the \n - 187.50g (1.50 cups) flour\n - 4.96g (1 teaspoon) cream of tartar\n - 2.30g (0.50 teaspoon) baking soda\n - 3.00g (0.50 teaspoon) salt";
  const result = convertRecipe(ingredientList, prepSteps);
  expect(result.indexOf(ingredientsString)).toBeGreaterThan(0);
  expect(result.indexOf(recipeString)).toBeGreaterThan(0);
});

// Todo: Test for "2 tablespoons of water" - expect and ignore the "of" between measure and the volume. Important especially in the prep steps
