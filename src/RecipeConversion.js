import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import {convertRecipe} from './RecipeConversion/convertRecipe';
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

import {getAnalytics} from 'firebase/analytics';
import {globalIngredientManager} from './RecipeConversion/DataStructures/ingredient';
// import {writeToDb} from './RecipeConversion/DataStructures/ingredient';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


function RecipeConversion() {
  useEffect(() => {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: 'AIzaSyC7Fma5ySeY6aQEaEfa4jxmLGJwENopkHA',
      authDomain: 'grantsrecipeorganizer.firebaseapp.com',
      projectId: 'grantsrecipeorganizer',
      storageBucket: 'grantsrecipeorganizer.appspot.com',
      messagingSenderId: '861327528051',
      appId: '1:861327528051:web:d5f63070610bcfa3f91a06',
      measurementId: 'G-Y7BH45V8W4',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    console.log(db != null);
    console.log(analytics != null);


    // writeToDb(db);
    globalIngredientManager.fetchIngredientsFromDb(db);
  }, []);

  const [outputText, setOutputText] = useState('');

  const minRows = 5;
  const [ingredientListText, setIngredientListText] = useState('');
  const [recipeText, setRecipeText] = useState('');

  const [ingredientListNumRows, setIngredientListNumRows] = useState(minRows);
  const ingredientTextAreaChange = (event) => {
    const textInput = event.target.value;
    setIngredientListText(textInput);
    const numLines = textInput.split('\n').length;
    setIngredientListNumRows(Math.max(minRows, numLines));
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