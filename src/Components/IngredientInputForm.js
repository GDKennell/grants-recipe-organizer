import React, {useEffect, useState} from 'react';
import useIngredientsStore from '../hooks/useIngredientsStore';
import useFirebase from '../hooks/useFirebase';
import {isNewIngredientValid} from '../Helpers/InputValidationHelpers';
import {addNewIngredient} from '../Database/DatabaseIngredients';

// eslint-disable-next-line react/prop-types
export default function IngredientInputForm({startText}) {
  const {ingredientManager, dispatch} = useIngredientsStore();
  const {firebaseUser, firebaseDb} = useFirebase();

  const [ingredientNamesText, setIngredientNamesText] = useState(startText);
  const [gramsPerCupText, setGramsPerCupText] = useState('');
  const [fieldsAreValid, setFieldsAreValid] = useState(false);
  const areFieldsValid = () => {
    if (firebaseUser == null) {
      return false;
    }
    return isNewIngredientValid(gramsPerCupText, ingredientNamesText, ingredientManager);
  };
  const validateFields = () => {
    setFieldsAreValid(areFieldsValid());
  };
  const handleIngredientChange = (event) => {
    setIngredientNamesText(event.target.value);
  };
  const handleGramsPerCupChange = (event) => {
    setGramsPerCupText(event.target.value);
  };

  useEffect(() => {
    validateFields();
  }, [gramsPerCupText, ingredientNamesText]);

  const handleSubmit = async () => {
    console.log(`Submitting ${ingredientNamesText} ${gramsPerCupText}`);
    const names = ingredientNamesText.split(',');
    const gramsPerCup = parseFloat(gramsPerCupText);
    addNewIngredient(names, gramsPerCup, firebaseDb, firebaseUser, dispatch, () => {
      setIngredientNamesText('');
      setGramsPerCupText('');
    });
  };
  return (
    <div>
            Add new ingredient ( <a href="https://www.aqua-calc.com/calculate/food-volume-to-weight" target="_blank" rel="noreferrer">look up grams per cup here </a> )
      <br/>
      <label>          Ingredient:
        <input type="text" onChange={handleIngredientChange} value={ingredientNamesText}/>
      </label>
      <label>          Grams per Cup:
        <input type="text" onChange={handleGramsPerCupChange} value={gramsPerCupText}/>
      </label>
      <button onClick={handleSubmit} disabled={!fieldsAreValid}> Submit </button>
    </div>
  );
}

