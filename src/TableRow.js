/* eslint-disable react/prop-types */
import React from 'react';
import useFirebase from './hooks/useFirebase';
import useIngredientsStore from './hooks/useIngredientsStore';
import {isIngredientOwned} from './RecipeConversion/DataStructures/ingredient';

export default function TableRow({rowData, key}) {
  const {ingredientManager} = useIngredientsStore();
  const {firebaseUser} = useFirebase();
  const isEditable = (isIngredientOwned(rowData, firebaseUser));
  const editableIngredientsExist = (ingredientManager.getUserScopedIngredients(firebaseUser).length > 0);

  return (
    <tr key={key} >
      <td style= {{border: '1px solid'}}>{rowData.names.join(', ')}</td>
      <td style= {{border: '1px solid'}}> {rowData.gramsPerCup} </td>
      <td style= {{border: '1px solid'}}> {`edit: ${isEditable} exists: ${editableIngredientsExist}`} </td>
    </tr>

  );
}


