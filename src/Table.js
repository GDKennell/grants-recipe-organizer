/* eslint-disable react/prop-types */
import React from 'react';
import useFirebase from './hooks/useFirebase';
import useIngredientsStore from './hooks/useIngredientsStore';
import TableRow from './TableRow';

export default function Table({data}) {
  const {ingredientManager} = useIngredientsStore();
  const {firebaseUser} = useFirebase();

  const headerData = {names: ['Ingredient Name(s)'], gramsPerCup: 'Grams per Cup'};
  return (
    <table style= {{border: '1px solid'}}>
      <tbody>
        <TableRow rowData={headerData}
          key = {'heyimakeygoshdarnit'}
          firebaseUser={firebaseUser}
          ingredientManager={ingredientManager}/>
        {data.map((rowData) =>
          <TableRow rowData={rowData}
            key={rowData.key}
            firebaseUser={firebaseUser}
            ingredientManager={ingredientManager}/>,
        )}
      </tbody>
    </table>
  );
}
