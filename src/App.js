import React from 'react';
import {useEffect, useState} from 'react';
import AdminPanel from './Pages/AdminPanel';
import './App.css';
// import useIngredientsStore from './hooks/useIngredientsStore';
import {isUserAdmin} from './Helpers/FirebaseManager';
import useFirebase from './hooks/useFirebase';
import IngredientPage from './Pages/IngredientPage';
import LoginPage from './Pages/LoginPage';
import MyIngredientsPage from './Pages/MyIngredientsPage';
import RecipeConversion from './Pages/RecipeConversion';

import Button from 'react-bootstrap/Button';

const PageType = {
  RECIPE_CONVERSION: 0,
  INGREDIENTS_PAGE: 1,
  LOGIN_PAGE: 2,
  MY_INGREDIENTS_PAGE: 3,
  ADMIN_PANEL: 4,

};


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
const defaultPageTypes = [PageType.RECIPE_CONVERSION,
  PageType.INGREDIENTS_PAGE,
  PageType.MY_INGREDIENTS_PAGE,
  PageType.LOGIN_PAGE];


function App() {
  const [showingPage, setShowingPage] = useState(PageType.RECIPE_CONVERSION);

  const {firebaseUser} = useFirebase();
  const [pageTypes, setPageTypes] = useState(defaultPageTypes);

  useEffect(() => {
    const userIsAdmin = isUserAdmin(firebaseUser);
    let newPageTypes = pageTypes;
    if (userIsAdmin && !newPageTypes.includes(PageType.ADMIN_PANEL)) {
      newPageTypes.push(PageType.ADMIN_PANEL);
    } else if (!userIsAdmin && newPageTypes.includes(PageType.ADMIN_PANEL)) {
      newPageTypes = pageTypes.filter((type) => {
        return type !=PageType.ADMIN_PANEL;
      });
    }
    setPageTypes(newPageTypes);
  }, [firebaseUser]);
  return (
    <div className="App">
      <br/>
      {pageTypes.map((type) => {
        return <Button
          key={nameforPageType(type)}
          onClick={ () => {
            setShowingPage(type);
          }} >
          {nameforPageType(type)}
        </Button>;
      }) }
      {getCurrentComponent(showingPage)}
    </div>
  );
}

export default App;
