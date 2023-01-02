/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {parseIngredientListLine} from '../RecipeConversion/RecipeParsing/ingredientParsing';
import {removeAllWhitespace, removeExtraNewLines} from '../RecipeConversion/utilities/stringHelpers';
import UnkownIngredientsSection from './UnkownIngredientsSection';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function RecipeInputForm({ingredientsChangedFn, recipeStepsChangedFn, initIngredientsText, initRecipeText}) {
  console.log(`RecipeInputForm render`);

  const {ingredientManager} = useIngredientsStore();

  const [unknownIngredients, setUnknownIngredients] = useState([]);
  const [numIngLines, setNumIngLines] = useState(4);
  const ingredientTextAreaChange = (event) => {
    const textInput = removeExtraNewLines(event.target.value);
    setNumIngLines(textInput.split('\n').length);
    ingredientsChangedFn(textInput);
    updateUnknownIngredients();
  };
  const recipeTextAreaChange = (event) => {
    const textInput = event.target.value;
    recipeStepsChangedFn(textInput);
    updateUnknownIngredients();
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
      <div className="form-outline mb-4">
        <textarea className="form-control textarea-autosize"
          id="textareaExample"
          rows={Math.max(4, numIngLines)}
          placeholder="Input Ingredient List"
          value={initIngredientsText}
          onChange={ingredientTextAreaChange} />
      </div>

      <UnkownIngredientsSection unknownIngredients={unknownIngredients}/>

      <div className="form-outline mb-4">
        <textarea className="form-control textarea-autosize"
          id="textareaExample"
          rows={4}
          placeholder="Preparation Steps"
          value={initRecipeText}
          onChange={recipeTextAreaChange} />
      </div>
    </div>
  );
}
