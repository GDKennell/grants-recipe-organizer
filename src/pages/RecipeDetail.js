/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {fetchSingleRecipeFromDb} from '../Database';
import useFirebase from '../hooks/useFirebase';
import {ingredientTextKey, recipeNameKey, recipeTextKey} from '../RecipeConversion/DataStructures/Recipe';

function parseRecipeDetailPath(path) {
  const components = path.split('/');
  return {userId: components[1], recipeId: components[3]};
}

export default function RecipeDetail() {
  const location = useLocation();
  const {firebaseDb} = useFirebase();
  const {userId, recipeId} = parseRecipeDetailPath(location.pathname);

  const [recipe, setRecipe] = useState(null);
  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetchSingleRecipeFromDb(firebaseDb, userId, recipeId);
      setRecipe(res);
    };
    if (firebaseDb) {
      fetchRecipe();
    }
  }, [firebaseDb]);


  return (
    <div> {!recipe ? 'Loading ...' :
<div className="container mt-5">
  <div className="row">
    <div className="col-12">
      <h1 className="text-center">{recipe[recipeNameKey] }</h1>
    </div>
  </div>
  <div className="row mt-5">
    <div className="col-12">
      <h3>Ingredients:</h3>
      <ul>
        {recipe[ingredientTextKey].split('\n').map(
            (line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  </div>
  <div className="row mt-5">
    <div className="col-12 display-linebreak">
      <h3>Steps:</h3>
      {recipe[recipeTextKey]}
    </div>
  </div>
</div>}
    </div>
  );
}
