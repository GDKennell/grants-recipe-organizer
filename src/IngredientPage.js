import './App.css'; import React from 'react';
// Import the functions you need from the SDKs you need
import Table from './Table';
import IngredientInputForm from './IngredientInputForm';
import useIngredientsStore from './hooks/useIngredientsStore';


function IngredientPage() {
  const {allIngredients} = useIngredientsStore();

  console.log(`Got ${allIngredients.length} ingredients`);

  return (
    <div>
      <h1>Ingredients Database</h1>
      <IngredientInputForm startText={undefined} />
      <br/>
      <Table data={allIngredients} />
    </div>
  );
};

export default IngredientPage;
