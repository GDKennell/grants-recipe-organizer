import React from 'react';
import useIngredientsStore from './hooks/useIngredientsStore';
import Table from './Table';

export default function MyIngredientsPage() {
  const {ingredientManager} = useIngredientsStore();

  return (
    <div><h1>My Ingredients</h1>
      <Table data={ingredientManager.getUserScopedIngredients} />
    </div>
  );
}
