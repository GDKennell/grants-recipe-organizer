import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

import {getAnalytics} from 'firebase/analytics';
import {globalIngredientManager} from './RecipeConversion/DataStructures/ingredient';

let firebaseInitialized = false;
let globalDb = null;
let globalApp = null;
let globalAnalytics = null;

let globalUser = null;
let globalCredential = null;
let globalToken = null;

export const globalFirebaseManager = {
  initialize: function() {
    if (firebaseInitialized) {
      return;
    }
    firebaseInitialized = true;
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
    globalApp = initializeApp(firebaseConfig);
    globalAnalytics = getAnalytics(globalApp);
    // Initialize Cloud Firestore and get a reference to the service
    globalDb = getFirestore(globalApp);
    console.log(globalDb != null);
    console.log(globalAnalytics != null);

    // writeToDb(db);
    globalIngredientManager.fetchIngredientsFromDb(globalDb);
  },
  getDb: function() {
    return globalDb;
  },
  userSignedIn: function(user, credential, token) {
    globalUser = user;
    globalCredential = credential;
    globalToken = token;
    globalIngredientManager.fetchUserScopedIngredients(globalDb, globalUser.uid);
  },
  getAuthDetails: function() {
    return [globalUser, globalCredential, globalToken];
  },
  getUser: function() {
    return globalUser;
  },
};
