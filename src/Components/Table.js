/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';
import TableRow from './TableRow';

export default function Table({data}) {
  const {ingredientManager} = useIngredientsStore();
  const {firebaseUser} = useFirebase();
  const [editingRowKey, setEditingRowKey] = useState(null);

  const startedEditingFn = (key) => {
    setEditingRowKey(key);
  };

  const headerData = {names: ['Ingredient Name(s)'], gramsPerCup: 'Grams per Cup', userId: null};
  return (
    <table style= {{border: '1px solid'}}>
      <tbody>
        <TableRow rowData={headerData}
          key = {'heyimakeygoshdarnit'}
          firebaseUser={firebaseUser}
          ingredientManager={ingredientManager}
          editingRowKey={editingRowKey}
          startedEditingFn={startedEditingFn}/>
        {data.map((rowData) =>
          <TableRow rowData={rowData}
            key={rowData.key}
            firebaseUser={firebaseUser}
            ingredientManager={ingredientManager}
            editingRowKey={editingRowKey}
            startedEditingFn={startedEditingFn}/>,
        )}
      </tbody>
    </table>
  );
}
