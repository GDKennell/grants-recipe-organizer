import React, {useState} from 'react';
import {collection, addDoc} from 'firebase/firestore';
import {globalFirebaseManager} from './FirebaseManager';

// eslint-disable-next-line react/prop-types
export default function IngredientInputForm({startText}) {
  const [ingredientText, setIngredientText] = useState(startText);
  const [gramsPerCupText, setGramsPerCupText] = useState('');
  const handleIngredientChange = (event) => {
    setIngredientText(event.target.value);
  };
  const handleGramsPerCupChange = (event) => {
    setGramsPerCupText(event.target.value);
  };

  const handleSubmit = async () => {
    const db = globalFirebaseManager.getDb();
    console.log(`Submitting ${ingredientText} ${gramsPerCupText}`);
    const names = ingredientText.split(',');
    const gramsPerCup = parseFloat(gramsPerCupText);
    try {
      await addDoc(collection(db, 'ingredients'), {
        names: names,
        gramsPerCup: gramsPerCup,
      });
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
      <button onClick={handleSubmit}> Submit </button>
    </div>
  );
}

