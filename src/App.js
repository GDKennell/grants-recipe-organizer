import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import IngredientPage from './IngredientPage';
import RecipeConversion from './RecipeConversion';

const PageType = {
  RECIPE_CONVERSION: 0,
  INGREDIENTS_PAGE: 1,
};


function getCurrentComponent(pageType) {
  switch (pageType) {
    case PageType.RECIPE_CONVERSION:
      return <RecipeConversion />;
    case PageType.INGREDIENTS_PAGE:
      return <IngredientPage />;
  }
  return <div />;
}
function App() {
  const [showingPage, setShowingPage] = useState(PageType.RECIPE_CONVERSION);
  useEffect(() => {

  }, []);

  const toggleButtonPressed = () => {
    console.log('Button');
    if (showingPage == PageType.RECIPE_CONVERSION) {
      setShowingPage(PageType.INGREDIENTS_PAGE);
    } else {
      setShowingPage(PageType.RECIPE_CONVERSION);
    }
  };
  const getButtonText = () => {
    if (showingPage == PageType.RECIPE_CONVERSION) {
      return 'Ingredients Page';
    }
    return 'Recipe Conversion Page';
  };
  return (
    <div className="App">
      <button onClick={toggleButtonPressed} > {getButtonText()}</button>
      {getCurrentComponent(showingPage)}
    </div>
  );
}

export default App;
