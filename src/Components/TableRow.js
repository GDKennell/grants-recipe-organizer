/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {updateUserIngredient} from '../Database';
import {isNewIngredientValid} from '../Helpers/InputValidationHelpers';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {makeIngredientObject} from '../RecipeConversion/DataStructures/ingredient';
import {sanitizeIngredientName} from '../RecipeConversion/utilities/stringHelpers';
import {isIngredientOwned} from '../RecipeConversion/DataStructures/ingredient';
import DeleteButton from './DeleteButton';

export default function TableRow({rowData,
  firebaseUser,
  ingredientManager,
  editingRowKey,
  startedEditingFn}) {
  const originalNames = rowData.names.join(', ');
  const originalGramsPerCupText = `${rowData.gramsPerCup}`;
  const {dispatch} = useIngredientsStore();
  const {firebaseDb} = useFirebase();


  const isEditable = (isIngredientOwned(rowData, firebaseUser));
  const editableIngredientsExist = (ingredientManager.getUserScopedIngredients(firebaseUser).length > 0);

  const [namesText, setNamesText] = useState(originalNames);
  const [gramsPerCupText, setGramsPerCupText] = useState(originalGramsPerCupText);
  const [isEditing, setIsEditing] = useState(false);

  const [saveEnabled, setSaveEnabled] = useState(false);
  const [editEnabled, setEditEnabled] = useState(true);

  useEffect(() => {
    setEditEnabled(editingRowKey == null);
  }, [editingRowKey]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    if (parseFloat(gramsPerCupText) == parseFloat(originalGramsPerCupText) &&
    sanitizeIngredientName(namesText) == sanitizeIngredientName(originalNames)) {
      setSaveEnabled(false);
      return;
    }
    if (!isNewIngredientValid(gramsPerCupText, namesText, ingredientManager, rowData)) {
      setSaveEnabled(false);
      return;
    }
    setSaveEnabled(true);
  }, [namesText, gramsPerCupText, isEditing]);

  const editPressed = () => {
    setIsEditing(true);
    startedEditingFn(rowData.key);
  };

  const savePressed = () => {
    if (!confirm(`Are you sure you want to update\n${originalNames} / ${originalGramsPerCupText} to \n${namesText} / ${gramsPerCupText}?`)) {
      return;
    }
    console.log(`Saved!`);
    setIsEditing(false);
    startedEditingFn(null);
    const newIngredient = makeIngredientObject(namesText.split(','), parseFloat(gramsPerCupText), /* isGlobal */ false, firebaseUser.id, null);
    updateUserIngredient(rowData, newIngredient, firebaseUser, firebaseDb, dispatch);
  };

  const cancelPressed = () => {
    setNamesText(originalNames);
    setGramsPerCupText(originalGramsPerCupText);
    setIsEditing(false);
    startedEditingFn(null);
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
        {isEditable && !isEditing && <button onClick={editPressed} disabled={!editEnabled}>Edit</button>}
        {isEditable && isEditing && <button onClick={savePressed} disabled={!saveEnabled}>Save</button>}
        {isEditable && isEditing && <button onClick={cancelPressed}>Cancel</button>}
      </td>}

    </tr>

  );
}


