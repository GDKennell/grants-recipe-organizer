import './App.css'; import React from 'react';
// Import the functions you need from the SDKs you need
import Table from './Table';
import IngredientInputForm from './IngredientInputForm';
import {globalIngredientManager} from './RecipeConversion/DataStructures/ingredient';


function IngredientPage() {
  console.log(`Got ${globalIngredientManager.getAllIngredients().length} ingredients`);

  const ingredients = globalIngredientManager.getAllIngredients().sort( (left, right) => {
    const l = left.names[0].toLocaleLowerCase();
    const r = right.names[0].toLocaleLowerCase();
    return l.localeCompare(r);
  });

  return (
    <div>
      <h1>IngredientPage Page</h1>
      <IngredientInputForm startText={undefined} />
      <br/>
      <Table data={ingredients} />
    </div>
  );
};

export default IngredientPage;
