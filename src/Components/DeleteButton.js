import React from 'react';
import {deleteUserIngredient} from '../Database';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';

// eslint-disable-next-line react/prop-types
export default function DeleteButton({ingredient}) {
  const {dispatch} = useIngredientsStore();
  const {firebaseDb, firebaseUser} = useFirebase();

  const deleteClicked = () => {
    deleteUserIngredient(ingredient, firebaseDb, firebaseUser, dispatch);
  };

  return (
    <button onClick={deleteClicked}> Delete </button>
  );
}
