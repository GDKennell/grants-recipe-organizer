import React, {useEffect, useState} from 'react';
import {collection, addDoc} from 'firebase/firestore';
import {globalFirebaseManager} from './FirebaseManager';
import {isValidNumberString, removeAllWhitespace} from './RecipeConversion/utilities/stringHelpers';
import {globalIngredientManager} from './RecipeConversion/DataStructures/ingredient';

// eslint-disable-next-line react/prop-types
export default function IngredientInputForm({startText}) {
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
      if (globalIngredientManager.isIngredientName(word) ) {
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
    const db = globalFirebaseManager.getDb();
    console.log(`Submitting ${ingredientText} ${gramsPerCupText}`);
    const names = ingredientText.split(',');
    const gramsPerCup = parseFloat(gramsPerCupText);
    const userId = globalFirebaseManager.getUser().uid;
    try {
      await addDoc(collection(db, 'users', userId, 'PrivateIngredients' ), {
        names: names,
        gramsPerCup: gramsPerCup,
      });
      console.log(`success adding document : ${names} ${gramsPerCup}`);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
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

