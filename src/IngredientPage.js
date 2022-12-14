import React from 'react';
import {useEffect} from 'react';
import './App.css';
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

import {getAnalytics} from 'firebase/analytics';
import {globalIngredientManager} from './RecipeConversion/DataStructures/ingredient';

function IngredientPage() {
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


  function getTable() {
    console.log(`Got ${globalIngredientManager.getAllIngredients().length} ingredients`);
    const ingredients = globalIngredientManager.getAllIngredients().sort( (left, right) => {
      const l = left.names[0].toLocaleLowerCase();
      const r = right.names[0].toLocaleLowerCase();
      return l.localeCompare(r);
    });
    return ingredients.map((ingredient) => {
      const names = ingredient.names.join(', ');
      return <div key={names + ingredient.gramsPerCup}> {names} | {ingredient.gramsPerCup}</div>;
    });
  };

  return (
    <div>

      <h1>IngredientPage Page</h1>

      <div> Ingredient | Grams per cup </div>
      <>
        {
          getTable()
        }
      </>

    </div>
  );
};

export default IngredientPage;
