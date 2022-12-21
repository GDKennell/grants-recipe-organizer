import {createSlice} from '@reduxjs/toolkit';
import {allHardCodedIngredients} from '../../RecipeConversion/DataStructures/hardCodedIngredients';
import {IngredientManager} from '../../RecipeConversion/DataStructures/ingredient';


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
  },
  reducers: {
    // {newIngredientList: [Ingredient]}
    replaceIngredientList: (state, action) => {
      state.ingredientList = [...action.payload.newIngredientList];
    },
    addNewIngredients: (state, action) => {
      for (const newIngredient of action.payload.newIngredients) {
        if (!isPreExistingIngredient(newIngredient, state.ingredientList)) {
          state.ingredientList.push(newIngredient);
        }
      }
    },
    userSignedOut: (state, action) => {
      state.ingredientList = state.ingredientList.filter((ingredient ) => {
        return ingredient.isGlobal;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  replaceIngredientList,
  addNewIngredients,
  userSignedOut,
} = ingredientStoreSlice.actions;

export default ingredientStoreSlice.reducer;
