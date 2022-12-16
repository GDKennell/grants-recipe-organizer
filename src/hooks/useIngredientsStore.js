import {useSelector, useDispatch} from 'react-redux';


const useIngredientsStore = () => {
  const allIngredients = useSelector((state) => state.ingredientStore.ingredientList);
  const dispatch = useDispatch();

  return {allIngredients, dispatch};
};

export default useIngredientsStore;
