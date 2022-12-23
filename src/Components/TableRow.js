/* eslint-disable react/prop-types */
import React from 'react';
import {isIngredientOwned} from '../RecipeConversion/DataStructures/ingredient';
import DeleteButton from './DeleteButton';

export default function TableRow({rowData, firebaseUser, ingredientManager}) {
  const isEditable = (isIngredientOwned(rowData, firebaseUser));
  const editableIngredientsExist = (ingredientManager.getUserScopedIngredients(firebaseUser).length > 0);

  return (
    <tr >
      <td style= {{border: '1px solid'}}>{rowData.names.join(', ')}</td>
      <td style= {{border: '1px solid'}}> {rowData.gramsPerCup} </td>
      {editableIngredientsExist && <td style= {{border: '1px solid'}}>
        {isEditable && <DeleteButton ingredient={rowData}/>}
      </td>}
      {editableIngredientsExist && <td style= {{border: '1px solid'}}> {`edit: ${isEditable} exists: ${editableIngredientsExist}`} </td>}
      <td style= {{border: '1px solid'}}> {`edit: ${isEditable} exists: ${editableIngredientsExist}`} </td>
    </tr>

  );
}


