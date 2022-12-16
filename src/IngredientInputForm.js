import React, {useEffect, useState} from 'react';
import {globalFirebaseManager} from './FirebaseManager';
import {isValidNumberString, removeAllWhitespace} from './RecipeConversion/utilities/stringHelpers';
import {addNewIngredient, IngredientManager} from './RecipeConversion/DataStructures/ingredient';
import useIngredientsStore from './hooks/useIngredientsStore';

// eslint-disable-next-line react/prop-types
export default function IngredientInputForm({startText}) {
  const {allIngredients, dispatch} = useIngredientsStore();
  const ingredientManager = new IngredientManager(allIngredients);
  const [ingredientText, setIngredientText] = useState(startText);
  const [gramsPerCupText, setGramsPerCupText] = useState('');
  const [fieldsAreValid, setFieldsAreValid] = useState(false);
  const areFieldsValid = () => {
    if (globalFirebaseManager.getUser() == null) {
      return false;
    }
    const gramsPerCupValue = parseFloat(gramsPerCupText);
    if (!isValidNumberString(gramsPerCupText)) {
      return false;
    }
    if (isNaN(gramsPerCupValue)) {
      return false;
    }
    if (removeAllWhitespace(ingredientText).length == 0) {
      return false;
    }
    const words = ingredientText.split(',');
    for (const word of words ) {
      if (ingredientManager.isIngredientName(word) ) {
        return false;
      }
    }
    return true;
  };
  const validateFields = () => {
    setFieldsAreValid(areFieldsValid());
  };
  const handleIngredientChange = (event) => {
    setIngredientText(event.target.value);
  };
  const handleGramsPerCupChange = (event) => {
    setGramsPerCupText(event.target.value);
  };

  useEffect(() => {
    validateFields();
  }, [gramsPerCupText, ingredientText]);

  const handleSubmit = async () => {
    console.log(`Submitting ${ingredientText} ${gramsPerCupText}`);
    const names = ingredientText.split(',');
    const gramsPerCup = parseFloat(gramsPerCupText);
    addNewIngredient(names, gramsPerCup, dispatch);
  };
  return (
    <div>
            Add new ingredient ( <a href="https://www.aqua-calc.com/calculate/food-volume-to-weight" target="_blank" rel="noreferrer">look up grams per cup here </a> )
      <br/>
      <label>          Ingredient:
        <input type="text" onChange={handleIngredientChange} value={ingredientText}/>
      </label>
      <label>          Grams per Cup:
        <input type="text" onChange={handleGramsPerCupChange} />
      </label>
      <button onClick={handleSubmit} disabled={!fieldsAreValid}> Submit </button>
    </div>
  );
}

