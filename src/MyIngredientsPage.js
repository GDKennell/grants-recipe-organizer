import React from 'react';
import useIngredientsStore from './hooks/useIngredientsStore';
import {IngredientManager} from './RecipeConversion/DataStructures/ingredient';
import Table from './Table';

export default function MyIngredientsPage() {
  const {allIngredients} = useIngredientsStore();
  const ingredientManager = new IngredientManager(allIngredients);
  const myIngredients = ingredientManager.getUserScopedIngredients;
  return (
    <div><h1>My Ingredients</h1>

      <Table data={myIngredients} />
    </div>
  );
}
