/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {parseIngredientListLine} from '../RecipeConversion/RecipeParsing/ingredientParsing';
import {removeAllWhitespace, removeExtraNewLines} from '../RecipeConversion/utilities/stringHelpers';
import UnkownIngredientsSection from './UnkownIngredientsSection';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';


export default function RecipeInputForm({ingredientsChangedFn, recipeStepsChangedFn, titleChangedFn, initIngredientsText, initRecipeText, initTitleText}) {
  const {ingredientManager} = useIngredientsStore();

  const [unknownIngredients, setUnknownIngredients] = useState([]);
  const [numIngLines, setNumIngLines] = useState(initIngredientsText.split('\n').length);
  const ingredientTextAreaChange = (event) => {
    const textInput = event.target.value;
    updateFromIngredients(textInput);
  };
  const updateFromIngredients = (ingredients) => {
    const textInput = removeExtraNewLines(ingredients);
    setNumIngLines(textInput.split('\n').length);
    ingredientsChangedFn(textInput);
    updateUnknownIngredients();
  };
  useEffect(() => {
    updateFromIngredients(initIngredientsText);
  }, [initIngredientsText]);

  const recipeTextAreaChange = (event) => {
    const textInput = event.target.value;
    recipeStepsChangedFn(textInput);
    updateUnknownIngredients();
  };

  const titleChanged = (event) => {
    const textInput = event.target.value;
    titleChangedFn(textInput);
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
  }, [ingredientManager]);


  return (
    <div className='padded-container'>
      <div className='mb-3'>
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Recipe Name</label>
        <input onChange={titleChanged} className="form-control" placeholder="Recipe Title" value={initTitleText}/>
      </div>
      <div className='mb-3'>
        <textarea className="form-control textarea-autosize"
          id="textareaExample"
          rows={Math.max(4, numIngLines)}
          placeholder="Input Ingredient List"
          value={initIngredientsText}
          onChange={ingredientTextAreaChange} />
      </div>

      <UnkownIngredientsSection unknownIngredients={unknownIngredients}/>
      Recipe:
      <div className="mb-3">
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
