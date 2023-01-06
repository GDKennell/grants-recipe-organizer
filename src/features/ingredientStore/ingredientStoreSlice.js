import {createSlice} from '@reduxjs/toolkit';
import {allHardCodedIngredients} from '../../RecipeConversion/DataStructures/hardCodedIngredients';
import {IngredientManager, ingredientsEqual} from '../../RecipeConversion/DataStructures/ingredient';


function isPreExistingIngredient(ingredient, existingList) {
  const ingredientManager = new IngredientManager(existingList);
  for (const name of ingredient.names) {
    if (ingredientManager.isIngredientName(name)) {
      return true;
    }
  }
  return false;
}


export const ingredientStoreSlice = createSlice({
  name: 'ingredientStore',
  initialState: {
    ingredientList: allHardCodedIngredients,
    userRecipesList: [],
  },
  reducers: {
    // {newIngredientList: [Ingredient]}
    replaceIngredientList: (state, action) => {
      state.ingredientList = [...action.payload.newIngredientList];
    },
    replaceUserRecipesList: (state, action) => {
      state.userRecipesList = [...action.payload.newUserRecipes];
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
} = ingredientStoreSlice.actions;

export default ingredientStoreSlice.reducer;
