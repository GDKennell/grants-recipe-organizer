import React from 'react';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';
import Table from '../Components/Table';
import UnkownIngredientsSection from '../Components/UnkownIngredientsSection';

export default function MyIngredientsPage() {
  const {ingredientManager} = useIngredientsStore();
  const {firebaseUser} = useFirebase();
  const emptyIngredientsList = [''];
  return (
    <div><h1>My Ingredients</h1>
      <UnkownIngredientsSection unknownIngredients={emptyIngredientsList} />
      <Table data={ingredientManager.getUserScopedIngredients(firebaseUser)} />
    </div>
  );
}
