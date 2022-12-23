/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {isIngredientOwned} from '../RecipeConversion/DataStructures/ingredient';
import DeleteButton from './DeleteButton';

export default function TableRow({rowData, firebaseUser, ingredientManager}) {
  const originalNames = rowData.names.join(', ');
  const originalGramsPerCup = rowData.gramsPerCup;

  const isEditable = (isIngredientOwned(rowData, firebaseUser));
  const editableIngredientsExist = (ingredientManager.getUserScopedIngredients(firebaseUser).length > 0);

  const [namesText, setNamesText] = useState(originalNames);
  const [gramsPerCupText, setGramsPerCupText] = useState(originalGramsPerCup);
  const [isEditing, setIsEditing] = useState(false);

  const editPressed = () => {
    setIsEditing(true);
  };

  const savePressed = () => {
    console.log(`Saved!`);
    setIsEditing(false);
  };

  const namesTextChaned = (event) => {
    setNamesText(event.target.value);
  };

  const gramsPerCupChanged = (event) => {
    setGramsPerCupText(event.target.value);
  };


  return (
    <tr >
      <td style= {{border: '1px solid'}}>
        {
      isEditing ?
      <input value={namesText} onChange={namesTextChaned} /> :
     <div>{namesText}</div>
        }
      </td>
      <td style= {{border: '1px solid'}}>
        {
      isEditing ?
      <input value={gramsPerCupText} onChange={gramsPerCupChanged} /> :
      <div>{gramsPerCupText}</div>
        }
      </td>
      {editableIngredientsExist && <td style= {{border: '1px solid'}}>
        {isEditable && <DeleteButton ingredient={rowData}/>}
      </td>}
      {editableIngredientsExist && <td style= {{border: '1px solid'}}>
        {isEditable && !isEditing && <button onClick={editPressed}>Edit</button>}
        {isEditable && isEditing && <button onClick={savePressed}>Save</button>}
      </td>}

    </tr>

  );
}


