/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {isNewIngredientValid} from '../Helpers/InputValidationHelpers';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {makeIngredientObject} from '../RecipeConversion/DataStructures/ingredient';
import {sanitizeIngredientName} from '../RecipeConversion/utilities/stringHelpers';
import {isIngredientOwned} from '../RecipeConversion/DataStructures/ingredient';
import DeleteButton from './DeleteButton';
import {isUserAdmin} from '../Helpers/FirebaseManager';
import {getNameForUserId, updateIngredient, promoteIngredient} from '../Database/DatabaseIngredients';

export default function TableRow({rowData,
  firebaseUser,
  ingredientManager,
  editingRowKey,
  isHeader,
  startedEditingFn}) {
  const originalNames = rowData.names.join(', ');
  const originalGramsPerCupText = `${rowData.gramsPerCup}`;
  const {dispatch} = useIngredientsStore();
  const {firebaseDb} = useFirebase();
  const isAdmin = isUserAdmin(firebaseUser);
  const canPromote = isAdmin && !isHeader;

  const isEditable = !isHeader && (isIngredientOwned(rowData, firebaseUser) || isAdmin);
  const editableIngredientsExist = (ingredientManager.getUserScopedIngredients(firebaseUser).length > 0);

  const [namesText, setNamesText] = useState(originalNames);
  const [gramsPerCupText, setGramsPerCupText] = useState(originalGramsPerCupText);
  const [isEditing, setIsEditing] = useState(false);

  const [saveEnabled, setSaveEnabled] = useState(false);
  const [editEnabled, setEditEnabled] = useState(true);
  const [promoteEnabled, setPromoteEnabled] = useState(true);

  const defaultName = isHeader ? 'User Name' : 'Global';
  const userName = getNameForUserId(rowData.userId, defaultName);

  useEffect(() => {
    setEditEnabled(editingRowKey == null);
  }, [editingRowKey]);

  useEffect(() => {
    setPromoteEnabled(!isEditing && !rowData.isGlobal);
  }, [isEditing]);

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
    const newIngredient = makeIngredientObject(namesText.split(','), parseFloat(gramsPerCupText), /* isGlobal */ rowData.isGlobal, firebaseUser.id, rowData.id);
    updateIngredient(rowData, newIngredient, firebaseUser, firebaseDb, dispatch);
  };

  const promotePressed = () => {
    promoteIngredient(firebaseDb, dispatch, rowData);
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
      { isAdmin && <td >
        {userName}
      </td>}
      <td >
        {
      isEditing ?
      <input value={namesText} onChange={namesTextChaned} /> :
     <div>{namesText}</div>
        }
      </td>
      <td >
        {
      isEditing ?
      <input value={gramsPerCupText} onChange={gramsPerCupChanged} /> :
      <div>{gramsPerCupText}</div>
        }
      </td>
      {editableIngredientsExist && <td >
        {isEditable && <DeleteButton ingredient={rowData}/>}
      </td>}
      {editableIngredientsExist && <td >
        {isEditable && !isEditing &&
        <button className='btn btn-primary'
          onClick={editPressed}
          disabled={!editEnabled}>Edit</button>}
        {isEditable && isEditing &&
        <button className='btn btn-primary'
          onClick={savePressed}
          disabled={!saveEnabled}>Save</button>}
        {isEditable && isEditing &&
        <button className='btn btn-primary'
          onClick={cancelPressed}>Cancel</button>}
      </td>}
      <td >
        {canPromote &&
        <button className='btn btn-primary'
          onClick={promotePressed} disabled={!promoteEnabled}>Promote</button>
        }
      </td>


    </tr>

  );
}


