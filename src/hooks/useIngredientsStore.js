import {useSelector} from 'react-redux';


const useIngredientsStore = () => {
  const allIngredients = useSelector((state) => state.counter.ingredientList);

  return allIngredients;
};

export default useIngredientsStore;
