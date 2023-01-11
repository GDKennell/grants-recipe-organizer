/* eslint-disable react/prop-types */
import React from 'react';
import {recipeManualEditTextKey, recipeNameKey} from '../RecipeConversion/DataStructures/Recipe';

export default function UnifiedRecipeView({recipe}) {
  const manualText = recipe[recipeManualEditTextKey];
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{recipe[recipeNameKey]}</h1>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 display-linebreak">
          {manualText}
        </div>
      </div>
    </div>
  );
}
