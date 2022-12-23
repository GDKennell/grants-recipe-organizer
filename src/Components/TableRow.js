/* eslint-disable react/prop-types */
import React from 'react';
import {deleteUserIngredient} from '../Database';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {isIngredientOwned} from '../RecipeConversion/DataStructures/ingredient';

export default function TableRow({rowData, firebaseUser, ingredientManager}) {
  const {dispatch} = useIngredientsStore();
  const {firebaseDb} = useFirebase();
  const isEditable = (isIngredientOwned(rowData, firebaseUser));
  const editableIngredientsExist = (ingredientManager.getUserScopedIngredients(firebaseUser).length > 0);

  const deleteClicked = () => {
    deleteUserIngredient(rowData, firebaseDb, firebaseUser, dispatch);
  };
  return (
    <tr >
      <td style= {{border: '1px solid'}}>{rowData.names.join(', ')}</td>
      <td style= {{border: '1px solid'}}> {rowData.gramsPerCup} </td>
      {editableIngredientsExist && <td style= {{border: '1px solid'}}>
        {isEditable && <button onClick={deleteClicked}> Delete </button>}
      </td>}
      {editableIngredientsExist && <td style= {{border: '1px solid'}}> {`edit: ${isEditable} exists: ${editableIngredientsExist}`} </td>}
      <td style= {{border: '1px solid'}}> {`edit: ${isEditable} exists: ${editableIngredientsExist}`} </td>
    </tr>

  );
}


