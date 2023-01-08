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

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">User Name</th>
          <th scope="col">Ingredient Name(s)</th>
          <th scope="col">Grams per Cup</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>

      <tbody>
        {data.map((rowData) =>
          <TableRow rowData={rowData}
            key={rowData.key}
            firebaseUser={firebaseUser}
            ingredientManager={ingredientManager}
            editingRowKey={editingRowKey}
            isHeader={false}
            startedEditingFn={startedEditingFn}/>,
        )}
      </tbody>
    </table>
  );
}
