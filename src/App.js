import React, {useState} from 'react';
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

const adminRoutes = [recipeConversionRoute,
  ingredientPageRoute,
  myIngredientsPageRoute,
  loginPageRoute,
  adminPanelRoute,
];

const normalUserRoutes = [recipeConversionRoute,
  ingredientPageRoute,
  myIngredientsPageRoute,
  loginPageRoute,
];

const notSignedInRoutes = [recipeConversionRoute,
  ingredientPageRoute,
  loginPageRoute,
];


export const routeToTitle = {};
routeToTitle[adminPanelRoute] = 'Admin Panel';
routeToTitle[ingredientPageRoute] = 'Ingredients DB';
routeToTitle[loginPageRoute] = 'Login';
routeToTitle[myIngredientsPageRoute] = 'My Ingredients';
routeToTitle[recipeConversionRoute] = 'Recipe Conversion';


function App() {
  const [allRoutes, setAllRoutes] = useState(notSignedInRoutes);

  const {firebaseUser} = useFirebase();
  useEffect(() => {
    if (isUserAdmin(firebaseUser)) {
      setAllRoutes(adminRoutes);
    } else if (firebaseUser) {
      setAllRoutes(normalUserRoutes);
    } else {
      setAllRoutes(notSignedInRoutes);
    }
  }, [firebaseUser]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout allRoutes={allRoutes}/>}>
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
