export const ingredientTextKey = 'ingredientTextKey';
export const recipeTextKey = 'recipeTextKey';
export const recipeNameKey = 'recipeNameKey';


function makeRecipe(recipeName, ingredientText, recipeText) {
  const obj = {};
  obj[ingredientTextKey] = ingredientText;
  obj[recipeTextKey] = recipeText;
  obj[recipeNameKey] = recipeName;
  return obj;
}

const pizzaDoughRecipe = makeRecipe( 'Pizza Dough',
    '2 1/2 cups warm water\n' +
'1/4 cup sugar\n' +
'3 teaspoons instant yeast\n' +
'1/4 cup vegetable oil\n' +
'6 cups all-purpose flour\n' +
'2 teaspoons salt',
    'In the bowl of a stand mixer, combine the water, sugar and yeast. Allow the mixture to sit for a few minutes until frothy. Add in the vegetable oil.\n' +
'\n' +
'In a bowl, combine the flour and the salt. Add the flour to the yeast mixture, ½ cup at a time, mixing well between additions. Continue adding the flour until the dough can be pulled away from the sides of the bowl with a spatula, but the dough will still be quite sticky. You may need to add in a little bit more or less flour, but the key is to remember that the dough will still be sticky and will stick to your fingers when you try to pull it apart.\n' +
'\n' +
'Grease a large bowl, then scrape the dough into the bowl. Turn the dough to coat it in oil. Cover the bowl with plastic wrap or a towel and a let the dough rise at room temperature until doubled, about 1 hour.\n' +
'\n' +
'Turn the dough out onto a well-floured work surface. Pull the dough around to the bottom, stretching it to create a smooth ball. Cut the dough into 3 equal portions. Each ball will be approximately 1 pound of dough.\n' +
'\n' +
'Roll out the dough to use in your favorite pizza recipe, or refrigerate until needed. (I have refrigerated it for several hours, up to overnight, but the dough will continue to rise, even in the refrigerator, so I try to use it before 24 hours.\n' +
'\n' +
'To bake, preheat a pizza stone in the oven as hot as you can go for at least 30 minutes. (I usually go between 475°F and 500°F.)\n' +
'\n' +
'Prepare your pizza with your desired toppings and bake until the crust is golden, 8-10 minutes.');

const chickenSaladRecipe = makeRecipe('Chicken Salad',
    '1/2 cup mayonnaise\n' +
'2 tablespoons sour cream\n' +
'1 tablespoon lemon juice\n' +
'1/8 teaspoon salt\n' +
'1/8 teaspoon pepper\n' +
'4 cups shredded rotisserie chicken\n' +
'1-1/4 cups seedless red grapes, halved\n' +
'1/2 cup chopped pecans\n' +
'1/2 cup chopped celery\n' +
'1/4 cup chopped sweet onion, optional\n' +
'Lettuce leaves or whole wheat bread slices, optional\n',
    'Step 1: Make Your Sauce\n' +
'\n' +
'Start by mixing the first five ingredients together for a creamy sauce. The sour cream and lemon juice add a tangy kick to this chunky chicken salad. Whisk together the mayonnaise, sour cream, lemon juice, salt and pepper until fully combined, tasting as you go, then set aside.\n' +
'\n' +
'Not a mayo fan? We’ve got you covered. Learn how to make chicken salad without mayo. We like using plain Greek yogurt or mashed avocado for extra creaminess.\n' +
'\n' +
'Step 2: Mix Together\n' +
'\n' +
'In a large bowl, mix together the shredded chicken, halved red grapes, chopped pecans and chopped celery. If using onion, add it along with your mayonnaise sauce. Toss to coat.\n' +
'\n' +
'Step 3: Serve and Store\n' +
'\n' +
'Once your chicken salad is combined, serve with fresh homemade bread, mixed greens salad or whole-grain crackers. Store leftovers in a sealed container in the refrigerator right away\n',
);

const gochujangCookiesRecipe = makeRecipe('Gochujang cookies',
    '½ cup (8 tablespoons)/115 grams unsalted butter, very soft\n' +
'2 packed tablespoons dark brown sugar\n' +
'1 heaping tablespoon gochujang\n' +
'1 cup/200 grams granulated sugar\n' +
'1 large egg, at room temperature\n' +
'½ teaspoon coarse kosher salt or ¾ teaspoon kosher salt (such as Diamond Crystal)\n' +
'¼ teaspoon ground cinnamon\n' +
'1 teaspoon vanilla extract\n' +
'½ teaspoon baking soda\n' +
'1½ cups/185 grams all-purpose flour\n',
    '1. Step 1\n' +
'In a small bowl, stir together 1 tablespoon butter, the brown sugar and gochujang until smooth. Set aside for later, at room temperature.\n' +
'2. Step 2\n' +
'In a large bowl, by hand, whisk together the remaining 7 tablespoons butter, the granulated sugar, egg, salt, cinnamon and vanilla until smooth, about 1 minute. Switch to a flexible spatula and stir in the baking soda. Add the flour and gently stir to combine. Place this large bowl in the refrigerator until the dough is less sticky but still soft and pliable, 15 to 20 minutes.\n' +
'3. Step 3\n' +
'While the dough is chilling, heat the oven to 350 degrees and line 2 large sheet pans with parchment.\n' +
'4. Step 4\n' +
'Remove the dough from the refrigerator. In 3 to 4 separately spaced out blobs, spoon the gochujang mixture over the cookie dough. Moving in long circular strokes, swirl the gochujang mixture into the cookie dough so you have streaks of orange-red rippled throughout the beige. Be sure not to overmix at this stage, as you want wide, distinct strips of gochujang.\n' +
'5. Step 5\n' +
'Use an ice cream scoop to plop out ¼-cup rounds spaced at least 3 inches apart on the sheet pans. (You should get 4 to 5 cookies per pan.) Bake until lightly golden at the edges and dry and set in the center, 11 to 13 minutes, rotating the pans halfway through. Let cool completely on the sheet pan; the cookies will flatten slightly and continue cooking as they cool. The cookies will keep in an airtight container at room temperature for up to 2 days.\n',

);

export const allHardCodedRecipes = [pizzaDoughRecipe, chickenSaladRecipe, gochujangCookiesRecipe];
