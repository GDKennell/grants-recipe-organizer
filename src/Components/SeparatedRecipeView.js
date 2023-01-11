/* eslint-disable react/prop-types */
import React, {useMemo} from 'react';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {convertRecipe} from '../RecipeConversion/convertRecipe';
import {ingredientTextKey, recipeTextKey} from '../RecipeConversion/DataStructures/Recipe';
import RecipeSharingHeader from './RecipeSharingHeader';

export default function SeparatedRecipeView({recipe}) {
  const {ingredientManager} = useIngredientsStore();
  const {ingredientsString, recipeString} = useMemo(() =>
    convertRecipe(recipe[ingredientTextKey], recipe[recipeTextKey], ingredientManager),
  [recipe, ingredientManager]);


  return (
    <div className="container mt-5">
      <RecipeSharingHeader recipe={recipe}/>
      <div className="row mt-5">
        <div className="col-12">
          <h3>Ingredients:</h3>
          <ul>
            {ingredientsString && ingredientsString.split('\n').map(
                (line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 display-linebreak">
          <h3>Steps:</h3>
          {recipeString}
        </div>
      </div>
    </div>
  );
}
