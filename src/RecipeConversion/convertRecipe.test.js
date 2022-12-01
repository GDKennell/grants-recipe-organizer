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

    ["1/4 cup cold vodka", "56.0g (0.25 cup)  cold vodka"],
    ["1/4 cup  cold water", "59.1g (0.25 cup)   cold water"],
  ];

  for (const testCase of testCases) {
    //   console.log("testing " + testCase[0]);
    const [result, ingredient] = parseIngredientListLine(testCase[0]);
    expect(result).toEqual(testCase[1]);
  }
});

test("Half cup cold shortening", () => {
  const testCases = [
    [
      "1/2 cup cold vegetable shortening, cut into small bits",
      "102.5g (0.50 cup)  cold vegetable shortening, cut into small bits",
    ],
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

test("cream vs cream of tartar", () => {
  const testCases = [
    ["1 teaspoon cream of tartar", "3.0g (1 teaspoon)  cream of tartar"],
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
    "> In the bowl of an electric mixer \n" +
    ">  - -  beat together the \n>  - butter\n>  and  \n>  - 0.75 cup sugar\n>  until fluffy \n>  - -  about 2 minutes \n>  - -  scraping down the sides as necessary \n>   Beat in the egg until creamy \n>  - -  and add the vanilla \n>  - -  again scraping down the sides \n>   Add the \n>  - flour\n>  mixture to the \n>  - butter\n>  mixture and beat on low until just combined";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("looks for longer ingredient if present", () => {
  const prepSteps =
    "Step 1\n" +
    "Heat the oven to 375 degrees. In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt.\n" +
    "\n" +
    "";

  const expected =
    "> Step 1 \n" +
    ">  Heat the oven to 375 degrees \n" +
    ">   In a medium bowl \n" +
    ">  - -  whisk together the \n" +
    ">  - flour\n" +
    ">  - cream of tartar\n" +
    ">  - baking soda\n" +
    ">  - salt";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("salt stuff I guess", () => {
  const prepSteps =
    "In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt.";
  const expected =
    "> In a medium bowl \n" +
    ">  - -  whisk together the \n" +
    ">  - flour\n" +
    ">  - cream of tartar\n" +
    ">  - baking soda\n" +
    ">  - salt";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("Keeps measurement with ingredient in recipe", () => {
  const prepSteps =
    "In a small bowl, combine the remaining 2 tablespoons sugar and the cinnamon. Roll the dough into golf-ball-size balls, then roll each one in the cinnamon-sugar mixture";
  const expected =
    "> In a small bowl \n" +
    ">  - -  combine the remaining \n" +
    ">  - 2 tablespoons sugar\n" +
    ">  and the \n" +
    ">  - cinnamon\n" +
    ">   Roll the dough into golf-ball-size balls \n" +
    ">  - -  roll each one in the cinnamon-sugar mixture";
  const result = parseRecipe(prepSteps);
  expect(result).toEqual(expected);
});

test("chicken salad ingredients", () => {
  //https://www.tasteofhome.com/article/easy-chicken-salad/
  const ingredientList =
    "1/2 cup mayonnaise\n" +
    "    2 tablespoons sour cream\n" +
    "    1 tablespoon lemon juice\n" +
    "    1/8 teaspoon salt\n" +
    "    1/8 teaspoon pepper\n" +
    "    4 cups shredded rotisserie chicken\n" +
    "    1-1/4 cups seedless red grapes, halved\n" +
    "    1/2 cup chopped pecans\n" +
    "    1/2 cup chopped celery\n" +
    "    1/4 cup chopped sweet onion, optional\n" +
    "\n" +
    "";
  const expectedIngredientList =
    "110.0g (0.50 cup)  mayonnaise\n" +
    "    28.7g (2 tablespoons)  sour cream\n" +
    "    15.5g (1 tablespoon)  lemon juice\n" +
    "    0.8g (0.13 teaspoon)  salt\n" +
    "    0.3g (0.13 teaspoon)  pepper\n" +
    "    595.2g (4 cups)  shredded rotisserie chicken\n" +
    "    115.0g (1.25 cups)  seedless red grapes, halved\n" +
    "    56.0g (0.50 cup)  chopped pecans\n" +
    "    1/2 cup chopped celery\n" +
    "    28.8g (0.25 cup)  chopped sweet onion, optional";
  const result = convertRecipe(ingredientList, "");
  expect(result.indexOf(expectedIngredientList)).toBeGreaterThan(0);
});

test("Brings ingredient amounts from list to prep steps", () => {
  const ingredientList =
    "1½ cups/180 grams all-purpose flour\n" +
    "1 teaspoon cream of tartar\n" +
    "½ teaspoon baking soda\n" +
    "½ teaspoon kosher salt\n" +
    "\n" +
    "";
  const prepSteps =
    "Step 1\n" +
    "Heat the oven to 375 degrees. In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt";
  const expectedIngredients =
    "187.5g (1.50 cups) /180 grams all-purpose flour\n" +
    "3.0g (1 teaspoon)  cream of tartar\n" +
    " 2.3g (0.50 teaspoon)  baking soda\n" +
    " 3.0g (0.50 teaspoon)  kosher salt";
  const expectedRecipe =
    "> Step 1 \n" +
    ">  Heat the oven to 375 degrees \n" +
    ">   In a medium bowl \n" +
    ">  - -  whisk together the \n" +
    ">  - 187.50g (1.50 cups) flour\n" +
    ">  - 3.00g (1 teaspoon) cream of tartar\n" +
    ">  - 2.30g (0.50 teaspoon) baking soda\n" +
    ">  - 3.00g (0.50 teaspoon) salt";
  const result = convertRecipe(ingredientList, prepSteps);
  expect(result.indexOf(expectedIngredients)).toBeGreaterThan(0);
  expect(result.indexOf(expectedRecipe)).toBeGreaterThan(0);
});

test("ingredients moved over and skip 'and'", () => {
  const ingredientList =
    "1½ cups/180 grams all-purpose flour\n" +
    "1 teaspoon cream of tartar\n" +
    "½ teaspoon baking soda\n" +
    "½ teaspoon kosher salt\n" +
    "10 tablespoons/140 grams unsalted butter (1¼ sticks), at room temperature\n" +
    "¾ cup/150 grams granulated sugar, plus 2 tablespoons\n" +
    "1 large egg\n" +
    "½ teaspoon vanilla extract\n" +
    "1 tablespoon ground cinnamon\n" +
    "\n" +
    "";
  const prepSteps =
    "Step 1\n" +
    "Heat the oven to 375 degrees. In a medium bowl, whisk together the flour, cream of tartar, baking soda and salt";
  const expectedIngredients =
    "187.5g (1.50 cups) /180 grams all-purpose flour\n" +
    "3.0g (1 teaspoon)  cream of tartar\n" +
    " 2.3g (0.50 teaspoon)  baking soda\n" +
    " 3.0g (0.50 teaspoon)  kosher salt\n" +
    "141.9g (10 tablespoons) /140 grams unsalted butter (1 1/4 sticks), at room temperature\n" +
    " 148.5g (0.75 cup) /150 grams granulated sugar, plus 2 tablespoons\n" +
    "1 large egg\n" +
    " 2.2g (0.50 teaspoon)  vanilla extract\n" +
    "7.8g (1 tablespoon)  ground cinnamon";
  const expectedRecipe =
    "> Step 1 \n" +
    ">  Heat the oven to 375 degrees \n" +
    ">   In a medium bowl \n" +
    ">  - -  whisk together the \n" +
    ">  - 187.50g (1.50 cups) flour\n" +
    ">  - 3.00g (1 teaspoon) cream of tartar\n" +
    ">  - 2.30g (0.50 teaspoon) baking soda\n" +
    ">  - 3.00g (0.50 teaspoon) salt";
  const result = convertRecipe(ingredientList, prepSteps);
  expect(result.indexOf(expectedIngredients)).toBeGreaterThan(0);
  expect(result.indexOf(expectedRecipe)).toBeGreaterThan(0);
});

test("weird line breaks", () => {
  const ingredientList = "";
  const prepSteps =
    "Step 1: Make Your Sauce\n" +
    "\n" +
    "Start by mixing the first five ingredients together for a creamy sauce. The sour cream and lemon juice add a tangy kick to this chunky chicken salad. Whisk together the mayonnaise, sour cream, lemon juice, salt and pepper until fully combined, tasting as you go, then set aside.\n" +
    "\n" +
    "Step 2 \n" +
    " Do another thing \n" +
    "  \n" +
    " \n" +
    " Step 3\n" +
    " Profit";
  const expectedRecipe =
    "> Step 1: Make Your Sauce \n" +
    "  \n" +
    ">  Start by mixing the first five ingredients together for a creamy sauce \n" +
    ">   The \n" +
    ">  - sour cream\n" +
    ">  - lemon juice\n" +
    ">  add a tangy kick to this chunky \n" +
    ">  - chicken\n" +
    ">  salad \n" +
    ">   Whisk together the \n" +
    ">  - mayonnaise\n" +
    ">  - sour cream\n" +
    ">  - lemon juice\n" +
    ">  - salt\n" +
    ">  - pepper\n" +
    ">  until fully combined \n" +
    ">  - -  tasting as you go \n" +
    ">  - -  set aside \n" +
    "  \n" +
    "  \n" +
    ">  Step 2  \n" +
    ">   Do another thing  \n" +
    "    \n" +
    "   \n" +
    ">   Step 3 \n" +
    ">   Profit";

  const result = convertRecipe(ingredientList, prepSteps);
  // expect(result).toEqual("");
  expect(result.indexOf(expectedRecipe)).toBeGreaterThan(0);
});

test("cream vs sour cream", () => {
  const ingredientList = "";
  const prepSteps =
    "Whisk together the mayonnaise, sour cream, lemon juice, salt and pepper until fully combined, tasting as you go, then set aside.";
  const expectedRecipe =
    "> Whisk together the \n" +
    ">  - mayonnaise\n" +
    ">  - sour cream\n" +
    ">  - lemon juice\n" +
    ">  - salt\n" +
    ">  - pepper\n" +
    ">  until fully combined \n" +
    ">  - -  tasting as you go \n" +
    ">  - -  set aside";
  const result = convertRecipe(ingredientList, prepSteps);
  expect(result.indexOf(expectedRecipe)).toBeGreaterThan(0);
});

test("new line before ingredient", () => {
  const ingredientList = "";
  const prepSteps =
    "Whisk together the \n" +
    "mayonnaise, \n" +
    "sour cream, lemon juice, salt and pepper until fully combined, tasting as you go, then set aside.";
  const expectedRecipe =
    "> Whisk together the  \n" +
    " \n" +
    ">  - mayonnaise\n" +
    " \n" +
    ">  - sour cream\n" +
    ">  - lemon juice\n" +
    ">  - salt\n" +
    ">  - pepper\n" +
    ">  until fully combined \n" +
    ">  - -  tasting as you go \n" +
    ">  - -  set aside";
  const result = convertRecipe(ingredientList, prepSteps);
  // expect(result).toEqual("");
  expect(result.indexOf(expectedRecipe)).toBeGreaterThan(0);
});

test("skip the next and thens", () => {
  const ingredientList = "";
  const prepSteps =
    "\n" +
    "Next, tightly wrap the twine around the spot you just tied another 2 or 3 times to secure the starting point of the roll. Then, pull the twine to the opposite end of the pork belly roll. Tightly wrap the twine around that end 2 to 3 times to secure it.\n" +
    "\n" +
    "Next, start wrapping the twine around the roll back toward the starting point. Space each wrap ⅓ inch (1 cm) apart. Make sure you wrap the roll as tightly as possible.\n" +
    "\n" +
    "";

  const expectedRecipe =
    ">  tightly wrap the twine around the spot you just tied another 2 or 3 times to secure the starting point of the roll \n" +
    ">   pull the twine to the opposite end of the pork belly roll \n" +
    ">   Tightly wrap the twine around that end 2 to 3 times to secure it \n" +
    "  \n" +
    "  \n" +
    ">  start wrapping the twine around the roll back toward the starting point \n" +
    ">   Space each wrap ⅓ inch (1 cm) apart \n" +
    ">   Make sure you wrap the roll as tightly as possible";
  const result = convertRecipe(ingredientList, prepSteps);
  expect(result.indexOf(expectedRecipe)).toBeGreaterThan(0);
});

test("b oil bug", () => {
  const ingredientList =
    "2-2½ lb pork belly block\n" +
    "1 Green Onion\n" +
    "1 knob ginger\n" +
    " 1 Tbsp canola oil\n" +
    "1 cup sake\n" +
    "1 cup soy sauce\n" +
    "2 cups water\n" +
    "2/3 cup sugar\n" +
    "\n" +
    "";
  const prepSteps =
    "> Bring the liquid to a boil over medium heat \n" +
    "  \n" +
    ">  Heat the \n" +
    ">  - 13.50g (1 Tbsp) oil\n" +
    ">  in";

  const expectedRecipeSnippet = "Bring the liquid to a boil";
  const result = convertRecipe(ingredientList, prepSteps);

  expect(result.indexOf(expectedRecipeSnippet)).toBeGreaterThan(0);
});

// test("carne asada", () => {
//   const ingredientList =
//     "2-3 lbs skirt or flank steak (roughly trimmed)\n1/4 cup regular strength soy sauce\n6 cloves garlic (minced)\n3 TB freshly squeezed lime juice\n2 TB olive or canola oil\n1 TB sugar\n2 tsp ground cumin\n2 tsp onion powder\n2 tsp ancho chili powder\n2 kiwi fruits\n\n";
//   const prepSteps =
//     "Seasonings: In a 9x13 pan or large dish, add the soy sauce, garlic, lime juice, oil, sugar, cumin, onion powder, and chili powder. Use hand whisk to incorporate well. Set aside.";
//   const expectedIngredients = "";
//   const expectedRecipe = "";
//   const result = convertRecipe(ingredientList, prepSteps);
//   expect(result.indexOf(expectedIngredients)).toBeGreaterThan(0);
//   expect(result.indexOf(expectedRecipe)).toBeGreaterThan(0);
// });

// Todo: Test for "2 tablespoons of water" - expect and ignore the "of" between measure and the volume. Important especially in the prep steps
// Todo: test for current bug caused by "Gather all the ingredients for the marinade: canola oil, sake, soy sauce, water, and sugar". The "And ... sugar" get put on their own lines
// Todo: "Keeps measurement with ingredient in recipe" test should change to not have the line with simply "and the"
// Todo: "new line before ingredient" test shouldn't have new lines inside the final result. Same in "b oil bug"
// Todo: clean up empty space at start of new lines like in "puts ingredients on new lines" test
