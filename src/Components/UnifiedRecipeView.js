/* eslint-disable react/prop-types */
import React from 'react';
import {recipeManualEditTextKey} from '../RecipeConversion/DataStructures/Recipe';
import RecipeSharingHeader from './RecipeSharingHeader';

export default function UnifiedRecipeView({recipe}) {
  const manualText = recipe[recipeManualEditTextKey];
  return (
    <div className="container mt-5">
      <RecipeSharingHeader recipe={recipe}/>
      <div className="row mt-5">
        <div className="col-12 display-linebreak">
          {manualText}
        </div>
      </div>
    </div>
  );
}
