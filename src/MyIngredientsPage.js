import React, {useState, useEffect} from 'react';
import useIngredientsStore from './hooks/useIngredientsStore';
import {IngredientManager} from './RecipeConversion/DataStructures/ingredient';
import Table from './Table';

export default function MyIngredientsPage() {
  const {allIngredients} = useIngredientsStore();
  const [myIngredients, setMyIngredients] = useState((new IngredientManager(allIngredients)).getUserScopedIngredients);
  console.log(`Rendering MyIngredientsPage with ${myIngredients.length} ingredients`);
  useEffect(() => {
    setMyIngredients((new IngredientManager(allIngredients)).getUserScopedIngredients);
    console.log(`Updating My Ingredients from   ${allIngredients.length} total ingredients`);
  }, [allIngredients]);

  return (
    <div><h1>My Ingredients</h1>
      <Table data={myIngredients} />
    </div>
  );
}
