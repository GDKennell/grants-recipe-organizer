import React from 'react';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';
import IngredientInputForm from '../Components/IngredientInputForm';
import Table from '../Components/Table';

export default function MyIngredientsPage() {
  const {ingredientManager} = useIngredientsStore();
  const {firebaseUser} = useFirebase();
  return (
    <div><h1>My Ingredients</h1>
      <IngredientInputForm startText={undefined} />
      <Table data={ingredientManager.getUserScopedIngredients(firebaseUser)} />
    </div>
  );
}
