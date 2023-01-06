import {useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {IngredientManager} from '../RecipeConversion/DataStructures/ingredient';


const useIngredientsStore = () => {
  const dispatch = useDispatch();
  const ingredientList = useSelector((state) => state.ingredientStore.ingredientList);
  const ingredientManager = useMemo(() => {
    return new IngredientManager(ingredientList);
  }, [ingredientList]);
  const userRecipesList = useSelector((state) => state.ingredientStore.userRecipesList);

  return {ingredientManager: ingredientManager,
    userRecipesList: userRecipesList,
    dispatch: dispatch};
};

export default useIngredientsStore;
