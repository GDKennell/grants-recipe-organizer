/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {fetchSingleRecipeFromDb} from '../Database';
import useFirebase from '../hooks/useFirebase';
import {recipeNameKey} from '../RecipeConversion/DataStructures/Recipe';

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
    <div> {recipe ? recipe[recipeNameKey] : 'Loading ...'}</div>
  );
}
