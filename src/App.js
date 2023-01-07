import React from 'react';
import {useEffect} from 'react';
import './App.css';
// import useIngredientsStore from './hooks/useIngredientsStore';
import {isUserAdmin} from './Helpers/FirebaseManager';
import useFirebase from './hooks/useFirebase';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

// import Button from 'react-bootstrap/Button';
import RecipeConversion from './pages/RecipeConversion';
import AdminPanel from './pages/AdminPanel';
import IngredientPage from './pages/IngredientPage';
import LoginPage from './pages/LoginPage';
import MyIngredientsPage from './pages/MyIngredientsPage';
import Layout from './pages/Layout';
import Home from './pages/Home';
import NoPage from './pages/NoPage';

export const adminPanelRoute = 'adminPanel';
export const ingredientPageRoute = 'ingredientPage';
export const loginPageRoute = 'loginPage';
export const myIngredientsPageRoute = 'myIngredientsPage';
export const recipeConversionRoute = 'recipeConversion';

export const allRoutes = [adminPanelRoute,
  ingredientPageRoute,
  loginPageRoute,
  myIngredientsPageRoute,
  recipeConversionRoute];

function App() {
  const {firebaseUser} = useFirebase();
  useEffect(() => {
    const userIsAdmin = isUserAdmin(firebaseUser);
    console.log(`user admin: ${userIsAdmin}`);
  }, [firebaseUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={adminPanelRoute} element={<AdminPanel />} />
          <Route path={ingredientPageRoute} element={<IngredientPage />} />
          <Route path={loginPageRoute} element={<LoginPage />} />
          <Route path={myIngredientsPageRoute} element={<MyIngredientsPage />} />
          <Route path={recipeConversionRoute} element={<RecipeConversion />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
