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

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    ingredientList: allHardCodedIngredients,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload.otherThing + action.payload.amountNumber;
    },
    // {newIngredientList: [Ingredient]}
    replaceIngredientList: (state, action) => {
      state.ingredientList = action.payload.newIngredientList;
    },
    addNewIngredients: (state, action) => {
      for (const newIngredient of action.payload.newIngredients) {
        if (!isPreExistingIngredient(newIngredient, state.ingredientList)) {
          state.ingredientList.push(newIngredient);
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  replaceIngredientList,
  addNewIngredients} = counterSlice.actions;

export default counterSlice.reducer;
