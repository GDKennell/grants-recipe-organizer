import {useSelector, useDispatch} from 'react-redux';

import {IngredientManager} from '../RecipeConversion/DataStructures/ingredient';

const useIngredientsStore = () => {
  const dispatch = useDispatch();
  const ingredientList = useSelector((state) => state.ingredientStore.ingredientList);

  return {ingredientManager: new IngredientManager(ingredientList),
    dispatch: dispatch};
};

export default useIngredientsStore;
