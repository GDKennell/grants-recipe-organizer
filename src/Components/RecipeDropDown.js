/* eslint-disable react/prop-types */
import React from 'react';
import {getRecipeByName} from '../RecipeConversion/DataStructures/hardCodedRecipes';
import {ingredientTextKey, recipeNameKey, recipeTextKey} from '../RecipeConversion/DataStructures/Recipe';

export default function RecipeDropDown({recipes, recipeSelected}) {
  const presetSelectChange = (arg) => {
    const selectedName = arg.target.value;
    const recipe = getRecipeByName(selectedName);
    recipeSelected(recipe[recipeNameKey],
        recipe[ingredientTextKey],
        recipe[recipeTextKey]);
  };

  return (
    <select onChange={presetSelectChange}>
      <option value="" disabled selected>Preset Recipe</option>
      {recipes.map((recipe) => {
        return <option key={recipe[recipeNameKey]}> {recipe[recipeNameKey]}</option>;
      })}
    </select>

  );
}
