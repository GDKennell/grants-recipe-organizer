/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {parseIngredientListLine} from '../RecipeConversion/RecipeParsing/ingredientParsing';
import {removeAllWhitespace, removeExtraNewLines} from '../RecipeConversion/utilities/stringHelpers';
import UnkownIngredientsSection from './UnkownIngredientsSection';

export default function RecipeInputForm({ingredientsChangedFn, recipeStepsChangedFn, initIngredientsText, initRecipeText}) {
  const minRows = 5;
  const {ingredientManager} = useIngredientsStore();

  const [ingredientListNumRows, setIngredientListNumRows] = useState(minRows);
  const [recipeNumRows, setRecipeNumRows] = useState(minRows);
  const [unknownIngredients, setUnknownIngredients] = useState([]);

  const ingredientTextAreaChange = (event) => {
    const textInput = removeExtraNewLines(event.target.value);
    ingredientsChangedFn(textInput);
    const numLines = textInput.split('\n').length;
    setIngredientListNumRows(Math.max(minRows, numLines));
  };
  const recipeTextAreaChange = (event) => {
    const textInput = event.target.value;
    recipeStepsChangedFn(textInput);
    const numLines = textInput.split('\n').length;
    setRecipeNumRows(Math.max(minRows, numLines));
  };


  const updateUnknownIngredients = () => {
    const localUnknownIngredients = [];

    const lines = initIngredientsText.split('\n');
    for (const origString of lines) {
      const [, ingredientString, realIngredient] = parseIngredientListLine(origString, ingredientManager);
      if (realIngredient == null && removeAllWhitespace(ingredientString).length > 0) {
        localUnknownIngredients.push(ingredientString);
      }
    }
    setUnknownIngredients(localUnknownIngredients);
  };

  useEffect(() => {
    updateUnknownIngredients();
  }, []);


  return (
    <div>
      <h3 className="instructions"> Paste recipe below:</h3>
      <div className="instructions">Ingredient list</div>
      <textarea
        className="ingredient-list input-field"
        rows={ingredientListNumRows}
        onChange={ingredientTextAreaChange}
        value={initIngredientsText}
      ></textarea>
      <UnkownIngredientsSection unknownIngredients={unknownIngredients}/>

      <div className="instructions">Preparation Steps</div>

      <textarea
        className="main-recipe input-field"
        onChange={recipeTextAreaChange}
        rows={recipeNumRows}
        value={initRecipeText}
      ></textarea>

    </div>
  );
}
