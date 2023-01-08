import React from 'react';
import {Link} from 'react-router-dom';
import {recipeConversionRoute} from '../App';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {recipeNameKey} from '../RecipeConversion/DataStructures/Recipe';

export default function MyRecipes() {
  const {userRecipesList} = useIngredientsStore();
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
              <Link className="btn btn-primary"
                aria-current="page"
                to={`/${recipeConversionRoute}`}
                state={{linkedRecipe: recipe}}>Edit</Link>
            </td>
            <td>
              <button className="btn btn-primary">Share</button>
            </td>
            <td>
              <button className="btn btn-primary">Delete</button>
            </td>
          </tr>,
        )}
      </tbody>
    </table> );
}
