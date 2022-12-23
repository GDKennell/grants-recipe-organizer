import './App.css'; import React from 'react';
// Import the functions you need from the SDKs you need
import Table from './Table';
import useIngredientsStore from './hooks/useIngredientsStore';


function IngredientPage() {
  const {ingredientManager} = useIngredientsStore();
  console.log(`IngredientPage redner: ing store: ${ingredientManager != null}`);

  return (
    <div>
      <h1>Ingredients Database</h1>
      <br/>
      <Table data={ingredientManager.getAllIngredients} />
    </div>
  );
};

export default IngredientPage;
