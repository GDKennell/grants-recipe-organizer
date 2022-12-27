import React from 'react';
import IngredientInputForm from '../Components/IngredientInputForm';
import Table from '../Components/Table';
import useIngredientsStore from '../hooks/useIngredientsStore';

export default function AdminPanel() {
  const {ingredientManager} = useIngredientsStore();

  return (
    <div><h1>Admin Panel</h1>
      <IngredientInputForm startText={undefined} />
      <Table data={ingredientManager.getAllUserScopedIngredients()} />
    </div>
  );
}
