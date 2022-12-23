import {useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {IngredientManager} from '../RecipeConversion/DataStructures/ingredient';


const useIngredientsStore = () => {
  const dispatch = useDispatch();
  const ingredientList = useSelector((state) => state.ingredientStore.ingredientList);
  const ingredientManager = useMemo(() => {
    return new IngredientManager(ingredientList);
  }, [ingredientList]);

  console.log(`useIngredientsStore hook making new IngredientManager(${ingredientList.length})`);
  return {ingredientManager: ingredientManager,
    dispatch: dispatch};
};

export default useIngredientsStore;
