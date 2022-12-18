import React from 'react';
import {useEffect, useState} from 'react';
import AdminPanel from './AdminPanel';
import './App.css';
import {globalFirebaseManager} from './FirebaseManager';
import useIngredientsStore from './hooks/useIngredientsStore';
import IngredientPage from './IngredientPage';
import LoginPage from './LoginPage';
import MyIngredientsPage from './MyIngredientsPage';
import RecipeConversion from './RecipeConversion';

const PageType = {
  RECIPE_CONVERSION: 0,
  INGREDIENTS_PAGE: 1,
  LOGIN_PAGE: 2,
  MY_INGREDIENTS_PAGE: 3,
  ADMIN_PANEL: 4,

};

const pageTypes = [PageType.RECIPE_CONVERSION,
  PageType.INGREDIENTS_PAGE,
  PageType.MY_INGREDIENTS_PAGE,
  PageType.LOGIN_PAGE];

function getCurrentComponent(pageType) {
  switch (pageType) {
    case PageType.RECIPE_CONVERSION:
      return <RecipeConversion />;
    case PageType.INGREDIENTS_PAGE:
      return <IngredientPage />;
    case PageType.LOGIN_PAGE:
      return <LoginPage/>;
    case PageType.MY_INGREDIENTS_PAGE:
      return <MyIngredientsPage/>;
    case PageType.ADMIN_PANEL:
      return <AdminPanel/>;
  }
  return <div />;
}

const nameforPageType = (pageType) => {
  switch (pageType) {
    case PageType.RECIPE_CONVERSION:
      return 'Recipe Conversion';
    case PageType.INGREDIENTS_PAGE:
      return 'All Ingredients';
    case PageType.LOGIN_PAGE:
      return 'Login';
    case PageType.MY_INGREDIENTS_PAGE:
      return 'My Ingredients';
    case PageType.ADMIN_PANEL:
      return 'Admin Panel';
  }
};

function App() {
  const [showingPage, setShowingPage] = useState(PageType.RECIPE_CONVERSION);
  const {dispatch} = useIngredientsStore();
  useEffect(() => {
    globalFirebaseManager.initialize(dispatch);
  }, []);

  // TODO read this from redux store
  const isUserAdmin = globalFirebaseManager.isUserAdmin();
  if (isUserAdmin && !pageTypes.includes(PageType.ADMIN_PANEL)) {
    pageTypes.push(PageType.ADMIN_PANEL);
  } else if (!isUserAdmin && pageTypes.includes(PageType.ADMIN_PANEL)) {
    console.log('TODO: Remove the admin panel from array here');
  }
  return (
    <div className="App">
      <br/>
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
