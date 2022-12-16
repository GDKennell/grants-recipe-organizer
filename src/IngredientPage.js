import './App.css'; import React from 'react';
// Import the functions you need from the SDKs you need
import Table from './Table';
import IngredientInputForm from './IngredientInputForm';
import {useSelector} from 'react-redux';


function IngredientPage() {
  const allIngredients = useSelector((state) => state.counter.ingredientList);
  console.log(`Got ${allIngredients.length} ingredients`);
  const localIngredients = [...allIngredients];
  localIngredients.sort( (left, right) => {
    const l = left.names[0].toLocaleLowerCase();
    const r = right.names[0].toLocaleLowerCase();
    return l.localeCompare(r);
  });

  return (
    <div>
      <h1>IngredientPage Page</h1>
      <IngredientInputForm startText={undefined} />
      <br/>
      <Table data={localIngredients} />
    </div>
  );
};

export default IngredientPage;
