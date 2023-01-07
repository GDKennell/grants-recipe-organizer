/* eslint-disable react/prop-types */
import React, {useMemo} from 'react';
import {ingredientTextKey, recipeManualEditTextKey, recipeNameKey, recipeTextKey} from '../RecipeConversion/DataStructures/Recipe';

export default function RecipeDropDown({recipes, recipeSelected, listName}) {
  const nameToRecipe = useMemo(() => {
    const localDict = {};
    for (const recipe of recipes) {
      localDict[recipe[recipeNameKey]] = recipe;
    }
    return localDict;
  }, [recipes]);

  const presetSelectChange = (arg) => {
    const selectedName = arg.target.value;
    const recipe = nameToRecipe[selectedName];
    recipeSelected(recipe[recipeNameKey],
        recipe[ingredientTextKey],
        recipe[recipeTextKey],
        recipe[recipeManualEditTextKey]);
  };

  return (
    <select onChange={presetSelectChange}>
      <option value="" disabled selected>{listName}...</option>
      {recipes.map((recipe) => {
        return <option key={recipe[recipeNameKey]}> {recipe[recipeNameKey]}</option>;
      })}
    </select>

  );
}
