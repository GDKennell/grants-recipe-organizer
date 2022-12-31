import React from 'react';
import {useEffect, useState} from 'react';
import '../App.css';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {convertRecipe} from '../RecipeConversion/convertRecipe';
// Import the functions you need from the SDKs you need
import {parseIngredientListLine} from '../RecipeConversion/RecipeParsing/ingredientParsing';
import {removeAllWhitespace, removeExtraNewLines} from '../RecipeConversion/utilities/stringHelpers';
import UnkownIngredientsSection from '../Components/UnkownIngredientsSection';
// eslint-disable-next-line no-unused-vars
import {allHardCodedRecipes, getRecipeByName, ingredientTextKey, recipeNameKey, recipeTextKey} from '../RecipeConversion/DataStructures/hardCodedRecipes';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const ingredientKey = 'ingKey';
const recipeKey = 'recKey';

function RecipeConversion() {
  const {ingredientManager} = useIngredientsStore();
  const [autoConvertedOutputText, setAutoConvertedOutputText] = useState('');

  const minRows = 5;
  const [ingredientListText, setIngredientListText] = useState(JSON.parse(localStorage.getItem(ingredientKey)) || '');
  const [recipeText, setRecipeText] = useState(JSON.parse(localStorage.getItem(recipeKey)) || '');

  const [unknownIngredients, setUnknownIngredients] = useState([]);

  const [ingredientListNumRows, setIngredientListNumRows] = useState(minRows);

  const updateUnknownIngredients = () => {
    const localUnknownIngredients = [];
    const lines = ingredientListText.split('\n');
    for (const origString of lines) {
      const [, ingredientString, realIngredient] = parseIngredientListLine(origString, ingredientManager);
      if (realIngredient == null && removeAllWhitespace(ingredientString).length > 0) {
        localUnknownIngredients.push(ingredientString);
      }
    }
    setUnknownIngredients(localUnknownIngredients);
  };


  const ingredientTextAreaChange = (event) => {
    const textInput = removeExtraNewLines(event.target.value);
    setIngredientListText(textInput);
  };

  const [recipeNumRows, setRecipeNumRows] = useState(minRows);
  const recipeTextAreaChange = (event) => {
    const textInput = event.target.value;
    setRecipeText(textInput);
    const numLines = textInput.split('\n').length;
    setRecipeNumRows(Math.max(minRows, numLines));
  };

  const autoConvertedOutputTextChange = (event) => {
    const textInput = event.target.value;
    setAutoConvertedOutputText(textInput);
  };

  const [outputNumRows, setOutputNumRows] = useState(minRows);

  useEffect(() => {
    const newValue = convertRecipe(ingredientListText, recipeText, ingredientManager);
    setAutoConvertedOutputText(newValue);
    setOutputNumRows(Math.max(minRows, newValue.split('\n').length));
    localStorage.setItem(ingredientKey, JSON.stringify(ingredientListText));
    localStorage.setItem(recipeKey, JSON.stringify(recipeText));
    updateUnknownIngredients();
    const numLines = ingredientListText.split('\n').length;
    setIngredientListNumRows(Math.max(minRows, numLines));
  }, [ingredientListText, recipeText, ingredientManager]);

  useEffect(() => {
    updateUnknownIngredients();
  }, []);

  const savePressed = () => {
    console.log(`Save recipe`);
  };
  const presetSelectChange = (arg) => {
    const selectedName = arg.target.value;
    const recipe = getRecipeByName(selectedName);
    setIngredientListText(recipe[ingredientTextKey]);
    setRecipeText(recipe[recipeTextKey]);
  };
  return (
    <div className="App">
      <div className="root-container">
        <h1 className="title"> Recipe Converter </h1>
        <select onChange={presetSelectChange}>
          <option value="" disabled selected>Preset Recipe</option>
          {allHardCodedRecipes.map((recipe) => {
            return <option key={recipe[recipeNameKey]}> {recipe[recipeNameKey]}</option>;
          })}
        </select>
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
        <button onClick={savePressed}>Save Recipe</button>
        <textarea
          className="main-recipe input-field"
          onChange={autoConvertedOutputTextChange}
          rows={outputNumRows}
          value={autoConvertedOutputText}
        ></textarea>

      </div>
    </div>
  );
}

export default RecipeConversion;
