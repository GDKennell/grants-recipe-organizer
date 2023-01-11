import React from 'react';
import {deleteIngredientFromDb} from '../Database/DatabaseIngredients';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';

// eslint-disable-next-line react/prop-types
export default function DeleteButton({ingredient}) {
  const {dispatch} = useIngredientsStore();
  const {firebaseDb, firebaseUser} = useFirebase();

  const deleteClicked = () => {
    deleteIngredientFromDb(ingredient, firebaseDb, firebaseUser, dispatch);
  };

  return (
    <button className='btn btn-primary' onClick={deleteClicked}> Delete </button>
  );
}
