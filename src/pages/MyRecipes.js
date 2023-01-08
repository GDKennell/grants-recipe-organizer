import React from 'react';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {recipeNameKey} from '../RecipeConversion/DataStructures/Recipe';

export default function MyRecipes() {
  const {userRecipesList} = useIngredientsStore();
  console.log(`${userRecipesList}`);
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Shared</th>
          <th scope="col">Recipe Name</th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {userRecipesList.map((recipe) =>
          <tr key={recipe[recipeNameKey]}>
            <td>private</td>
            <td>{recipe[recipeNameKey]}</td>
            <td>
              <button>Share</button>
            </td>
            <td>
              <button>Edit</button>
            </td>
            <td>
              <button>Delete</button>
            </td>
          </tr>,
        )}
      </tbody>
    </table> );
}
