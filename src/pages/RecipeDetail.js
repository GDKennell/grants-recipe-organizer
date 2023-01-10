/* eslint-disable react/prop-types */
import React from 'react';
import {useLocation} from 'react-router-dom';

function parseRecipeDetailPath(path) {
  const components = path.split('/');
  return {userId: components[1], recipeId: components[3]};
}

export default function RecipeDetail() {
  const location = useLocation();
  const {userId, recipeId} = parseRecipeDetailPath(location.pathname);


  return (
    <div> User Id: {userId}  Recipe ID: {recipeId}</div>
  );
}
