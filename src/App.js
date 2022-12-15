import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import {globalFirebaseManager} from './FirebaseManager';
import IngredientPage from './IngredientPage';
import LoginPage from './LoginPage';
import RecipeConversion from './RecipeConversion';

const PageType = {
  RECIPE_CONVERSION: 0,
  INGREDIENTS_PAGE: 1,
  LOGIN_PAGE: 2,
};

const pageTypes = [PageType.RECIPE_CONVERSION, PageType.INGREDIENTS_PAGE, PageType.LOGIN_PAGE];

function getCurrentComponent(pageType) {
  switch (pageType) {
    case PageType.RECIPE_CONVERSION:
      return <RecipeConversion />;
    case PageType.INGREDIENTS_PAGE:
      return <IngredientPage />;
    case PageType.LOGIN_PAGE:
      return <LoginPage/>;
  }
  return <div />;
}

const nameforPageType = (pageType) => {
  switch (pageType) {
    case PageType.RECIPE_CONVERSION:
      return 'Recipe Conversion';
    case PageType.INGREDIENTS_PAGE:
      return 'Ingredients';
    case PageType.LOGIN_PAGE:
      return 'Login';
  }
};

function App() {
  const [showingPage, setShowingPage] = useState(PageType.RECIPE_CONVERSION);
  useEffect(() => {
    globalFirebaseManager.initialize();
  }, []);

  return (
    <div className="App">
      {pageTypes.map((type) => {
        return <button key={nameforPageType(type)}
          onClick={ () => {
            setShowingPage(type);
          }} >
          {nameforPageType(type)}
        </button>;
      }) }
      {getCurrentComponent(showingPage)}
    </div>
  );
}

export default App;
