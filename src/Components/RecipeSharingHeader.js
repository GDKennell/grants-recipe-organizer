/* eslint-disable react/prop-types */

import React from 'react';
import {recipeIsPublicKey, recipeNameKey} from '../RecipeConversion/DataStructures/Recipe';
import {Button} from 'react-bootstrap';
import {makeRecipePrivate, makeRecipePublic} from '../Database/DatabaseRecipes';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';

export default function RecipeSharingHeader({recipe}) {
  const isPublic = recipe[recipeIsPublicKey];
  const {dispatch} = useIngredientsStore();
  const {firebaseDb, firebaseUser} = useFirebase();
  const title = recipe[recipeNameKey];
  const handlePublicToggle = () => {
    if (isPublic) {
      makeRecipePrivate(recipe, firebaseDb, firebaseUser, dispatch);
    } else {
      makeRecipePublic(recipe, firebaseDb, firebaseUser, dispatch);
    }
  };

  const handleCopyLink = () => {
    alert('Copy your own link you fool');
  };


  return (
    <header className="d-flex align-items-center justify-content-between mb-4">
      <p className="text-secondary mr-3">{isPublic ? 'Public' : 'Private'}</p>
      <div className="d-flex align-items-center">
        <h1 className="mb-0 text-center">{title}</h1>
      </div>
      {isPublic ? (
        < >
          <Button variant="secondary" onClick={handlePublicToggle} >
            Make Private
          </Button>
          <Button variant="secondary" onClick={handleCopyLink}>
            Copy Link
          </Button>
        </>
      ) : (
        <Button variant="secondary" onClick={handlePublicToggle}>
          Make Public
        </Button>
      )}
    </header>
  );
};


