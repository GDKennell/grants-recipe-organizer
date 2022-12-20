import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {IngredientManager} from '../RecipeConversion/DataStructures/ingredient';
function safeLength(arr) {
  return arr ? arr.length : 0;
}

const useIngredientsStore = () => {
  const dispatch = useDispatch();
  const ingredientList = useSelector((state) => state.ingredientStore.ingredientList);

  const [ingredientManager, setIngredientManager] = useState(new IngredientManager(ingredientList));
  useEffect(() => {
    console.log(`useEffect() hook. got update with  ${safeLength(ingredientList)}  ingredients`);

    setIngredientManager(new IngredientManager(ingredientList));
  }, [ingredientList]);
  console.log(`useIngredientsStore() hook. returning manager with   ${safeLength(ingredientManager.getAllIngredients)}  ingredients`);

  return {ingredientManager, dispatch};
};

export default useIngredientsStore;
