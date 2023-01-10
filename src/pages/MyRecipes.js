import React from 'react';
import {Link} from 'react-router-dom';
import {recipeConversionRoute, recipeDetailRoute} from '../App';
import useFirebase from '../hooks/useFirebase';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {recipeDocIdKey, recipeNameKey} from '../RecipeConversion/DataStructures/Recipe';

export default function MyRecipes() {
  const {userRecipesList} = useIngredientsStore();
  const {firebaseUser} = useFirebase();

  const linkForRecipe = (recipe) => {
    const recipeId = recipe[recipeDocIdKey];
    const userId = firebaseUser ? firebaseUser.uid : null;
    if (recipeId && userId) {
      const path = `/${userId}/${recipeDetailRoute}/${recipe[recipeDocIdKey]}`;
      return <Link aria-current="page"
        to={path}
        state={{linkedRecipe: recipe}}> {recipe[recipeNameKey]}</Link>;
    }
    return recipe[recipeNameKey];
  };
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
            <td>
              {linkForRecipe(recipe)}
            </td>
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
