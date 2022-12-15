import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import {convertRecipe} from './RecipeConversion/convertRecipe';
// Import the functions you need from the SDKs you need
import {globalIngredientManager} from './RecipeConversion/DataStructures/ingredient';
import {parseIngredientListLine} from './RecipeConversion/RecipeParsing/ingredientParsing';
import UnkownIngredientsSection from './UnkownIngredientsSection';
// import {writeToDb} from './RecipeConversion/DataStructures/ingredient';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


function RecipeConversion() {
  const [outputText, setOutputText] = useState('');

  const minRows = 5;
  const [ingredientListText, setIngredientListText] = useState('');
  const [recipeText, setRecipeText] = useState('');

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
      if (realIngredient == null ) {
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
        ></textarea>
        <UnkownIngredientsSection unknownIngredients={unknownIngredients}/>
        <div className="instructions">Preparation Steps</div>

        <textarea
          className="main-recipe input-field"
          onChange={recipeTextAreaChange}
          rows={recipeNumRows}
        ></textarea>
        <h3 className="instructions"> Converted Recipe:</h3>

        <div className="output-field">{outputText}</div>
      </div>
    </div>
  );
}

export default RecipeConversion;
