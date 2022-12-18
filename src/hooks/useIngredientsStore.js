import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {IngredientManager} from '../RecipeConversion/DataStructures/ingredient';

const useIngredientsStore = () => {
  const dispatch = useDispatch();
  const allIngredients = useSelector((state) => state.ingredientStore.ingredientList);
  const [ingredientManager, setIngredientManager] = useState(new IngredientManager(allIngredients));
  useEffect(() => {
    setIngredientManager(new IngredientManager(allIngredients));
  }, [allIngredients]);

  return {ingredientManager, dispatch};
};

export default useIngredientsStore;
