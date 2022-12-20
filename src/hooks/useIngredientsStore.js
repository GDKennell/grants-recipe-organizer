import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {IngredientManager} from '../RecipeConversion/DataStructures/ingredient';

const useIngredientsStore = () => {
  const dispatch = useDispatch();
  const ingredientList = useSelector((state) => state.ingredientStore.ingredientList);

  const [ingredientManager, setIngredientManager] = useState(new IngredientManager(ingredientList));
  useEffect(() => {
    setIngredientManager(new IngredientManager(ingredientList));
  }, [ingredientList]);

  return {ingredientManager, dispatch};
};

export default useIngredientsStore;
