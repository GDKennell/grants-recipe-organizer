import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import {convertRecipe} from './RecipeConversion/convertRecipe';
// Import the functions you need from the SDKs you need
import {globalIngredientManager} from './RecipeConversion/DataStructures/ingredient';
import {parseIngredientListLine} from './RecipeConversion/RecipeParsing/ingredientParsing';
import {removeAllWhitespace} from './RecipeConversion/utilities/stringHelpers';
import UnkownIngredientsSection from './UnkownIngredientsSection';
// import {writeToDb} from './RecipeConversion/DataStructures/ingredient';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const ingredientKey = 'ingKey';
const recipeKey = 'recKey';

function RecipeConversion() {
  const [outputText, setOutputText] = useState('');

  const minRows = 5;
  const [ingredientListText, setIngredientListText] = useState(JSON.parse(localStorage.getItem(ingredientKey)) || '');
  const [recipeText, setRecipeText] = useState(JSON.parse(localStorage.getItem(recipeKey)) || '');

  const [unknownIngredients, setUnknownIngredients] = useState([]);

  const [ingredientListNumRows, setIngredientListNumRows] = useState(minRows);
  const ingredientTextAreaChange = (event) => {
    const textInput = event.target.value;
    setIngredientListText(textInput);
    const numLines = textInput.split('\n').length;
    setIngredientListNumRows(Math.max(minRows, numLines));

    const localUnknownIngredients = [];
    const lines = textInput.split('\n');
    for (const origString of lines) {
      const [, ingredientString, realIngredient] = parseIngredientListLine(origString, globalIngredientManager);
      if (realIngredient == null && removeAllWhitespace(ingredientString).length > 0) {
        localUnknownIngredients.push(ingredientString);
      }
    }
    setUnknownIngredients(localUnknownIngredients);
  };

  const [recipeNumRows, setRecipeNumRows] = useState(minRows);
  const recipeTextAreaChange = (event) => {
    const textInput = event.target.value;
    setRecipeText(textInput);
    const numLines = textInput.split('\n').length;
    setRecipeNumRows(Math.max(minRows, numLines));
  };

  useEffect(() => {
    const newValue = convertRecipe(ingredientListText, recipeText, globalIngredientManager);
    setOutputText(newValue);
    localStorage.setItem(ingredientKey, JSON.stringify(ingredientListText));
    localStorage.setItem(recipeKey, JSON.stringify(recipeText));
  }, [ingredientListText, recipeText]);

  return (
    <div className="App">
      <div className="root-container">
        <h1 className="title"> Recipe Converter </h1>
        <h3 className="instructions"> Paste recipe below:</h3>
        <div className="instructions">Ingredient list</div>
        <textarea
          className="ingredient-list input-field"
          rows={ingredientListNumRows}
          onChange={ingredientTextAreaChange}
          value={ingredientListText}
        ></textarea>
        <UnkownIngredientsSection unknownIngredients={unknownIngredients}/>
        <div className="instructions">Preparation Steps</div>

        <textarea
          className="main-recipe input-field"
          onChange={recipeTextAreaChange}
          rows={recipeNumRows}
          value={recipeText}
        ></textarea>
        <h3 className="instructions"> Converted Recipe:</h3>

        <div className="output-field">{outputText}</div>
      </div>
    </div>
  );
}

export default RecipeConversion;
