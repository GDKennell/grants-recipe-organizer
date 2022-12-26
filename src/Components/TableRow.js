/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {isIngredientValid} from '../Helpers/InputValidationHelpers';
import {isIngredientOwned} from '../RecipeConversion/DataStructures/ingredient';
import DeleteButton from './DeleteButton';

export default function TableRow({rowData, firebaseUser, ingredientManager}) {
  const originalNames = rowData.names.join(', ');
  const originalGramsPerCupText = `${rowData.gramsPerCup}`;

  const isEditable = (isIngredientOwned(rowData, firebaseUser));
  const editableIngredientsExist = (ingredientManager.getUserScopedIngredients(firebaseUser).length > 0);

  const [namesText, setNamesText] = useState(originalNames);
  const [gramsPerCupText, setGramsPerCupText] = useState(originalGramsPerCupText);
  const [isEditing, setIsEditing] = useState(false);

  const [saveEnabled, setSaveEnabled] = useState(false);

  useEffect(() => {
    console.log(`useEffect : namesText: ${namesText} gramsPerCupText: ${gramsPerCupText} originalNames:${originalNames}  originalGramsPerCupText:${originalGramsPerCupText}`);
    setSaveEnabled(isIngredientValid(namesText, gramsPerCupText) &&
    (gramsPerCupText != originalGramsPerCupText || namesText != originalNames));
  }, [namesText, gramsPerCupText]);

  const editPressed = () => {
    setIsEditing(true);
  };

  const savePressed = () => {
    if (!confirm(`Are you sure you want to update\n${originalNames} / ${originalGramsPerCupText} to \n${namesText} / ${gramsPerCupText}?`)) {
      return;
    }
    console.log(`Saved!`);
    setIsEditing(false);
    // TODO: Save change to local & remote DB
  };

  const cancelPressed = () => {
    setNamesText(originalNames);
    setGramsPerCupText(originalGramsPerCupText);
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
        {isEditable && isEditing && <button onClick={savePressed} disabled={!saveEnabled}>Save</button>}
        {isEditable && isEditing && <button onClick={cancelPressed}>Cancel</button>}
      </td>}

    </tr>

  );
}


