/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import SeparatedRecipeView from '../Components/SeparatedRecipeView';
import UnifiedRecipeView from '../Components/UnifiedRecipeView';
import {fetchSingleRecipeFromDb} from '../Database/DatabaseRecipes';
import useFirebase from '../hooks/useFirebase';
import {hasManualEdits} from '../RecipeConversion/DataStructures/Recipe';

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
    hasManualEdits(recipe) ?
    <UnifiedRecipeView recipe={recipe}/> :
    <SeparatedRecipeView recipe={recipe}/>
    }
    </div>
  );
}
