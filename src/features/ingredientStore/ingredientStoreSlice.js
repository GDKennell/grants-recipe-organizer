import {createSlice} from '@reduxjs/toolkit';
import {allHardCodedIngredients} from '../../RecipeConversion/DataStructures/hardCodedIngredients';
import {IngredientManager, ingredientsEqual} from '../../RecipeConversion/DataStructures/ingredient';
import {recipesMatch} from '../../RecipeConversion/DataStructures/Recipe';


function isPreExistingIngredient(ingredient, existingList) {
  const ingredientManager = new IngredientManager(existingList);
  for (const name of ingredient.names) {
    if (ingredientManager.isIngredientName(name)) {
      return true;
    }
  }
  return false;
}

function sortRecipesByName(recipes) {
  recipes.sort(function(a, b) {
    const nameA = a.recipeNameKey.toUpperCase();
    const nameB = b.recipeNameKey.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return recipes;
}


export const ingredientStoreSlice = createSlice({
  name: 'ingredientStore',
  initialState: {
    ingredientList: allHardCodedIngredients,
    userRecipesList: [],
    globalRecipesList: [],
  },
  reducers: {
    // {newIngredientList: [Ingredient]}
    replaceIngredientList: (state, action) => {
      state.ingredientList = [...action.payload.newIngredientList];
    },
    replaceUserRecipesList: (state, action) => {
      state.userRecipesList = [...action.payload.newUserRecipes];
      state.userRecipesList = sortRecipesByName(state.userRecipesList);
    },
    replaceGlobalRecipesList: (state, action) => {
      state.globalRecipesList = [...action.payload.newGlobalRecipes];
      state.globalRecipesList = sortRecipesByName(state.globalRecipesList);
    },
    recipeChanged: (state, action)=> {
      const changedRecipe = action.payload.changedRecipe;
      state.userRecipesList = state.userRecipesList.filter(
          (recipe) => !recipesMatch(recipe, changedRecipe));
      state.userRecipesList.push(changedRecipe);
      state.userRecipesList = sortRecipesByName(state.userRecipesList);
    },
    addNewIngredients: (state, action) => {
      for (const newIngredient of action.payload.newIngredients) {
        if (newIngredient.isGlobal) {
          state.ingredientList = state.ingredientList.filter((ing) => !ingredientsEqual(ing, newIngredient));
        }
        if (!isPreExistingIngredient(newIngredient, state.ingredientList)) {
          state.ingredientList.push(newIngredient);
        }
      }
    },
    deleteIngredient: (state, action) => {
      const oldAmount = state.ingredientList.length;
      state.ingredientList = state.ingredientList.filter((ing) => {
        return ing.id != action.payload.ingredientToDelete.id;
      });
      const deletionOccurred = state.ingredientList.length < oldAmount;
      console.log(`deleteIngredient: did delete? ${deletionOccurred}`);
    },
    userSignedOut: (state, action) => {
      state.ingredientList = state.ingredientList.filter((ingredient ) => {
        return ingredient.isGlobal;
      });
    },
    ingredientUpdated: (state, action) => {
      const newIngredient = action.payload.updatedIngredient;
      state.ingredientList = state.ingredientList.filter((ingredient ) => {
        return ingredient.id != newIngredient.id;
      });
      state.ingredientList.push(newIngredient);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  replaceIngredientList,
  addNewIngredients,
  deleteIngredient,
  userSignedOut,
  ingredientUpdated,
  replaceUserRecipesList,
  replaceGlobalRecipesList,
  recipeChanged,
} = ingredientStoreSlice.actions;

export default ingredientStoreSlice.reducer;
