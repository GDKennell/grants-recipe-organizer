import React from 'react';
import useFirebase from './hooks/useFirebase';
import useIngredientsStore from './hooks/useIngredientsStore';
import Table from './Table';

export default function MyIngredientsPage() {
  const {dispatch, ingredientManager} = useIngredientsStore();
  const {firebaseUser} = useFirebase(dispatch, ingredientManager);
  return (
    <div><h1>My Ingredients</h1>
      <Table data={ingredientManager.getUserScopedIngredients(firebaseUser)} />
    </div>
  );
}
