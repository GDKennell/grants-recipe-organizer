import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

import {getAnalytics} from 'firebase/analytics';
import {fetchIngredientsFromDb, fetchUserScopedIngredients} from './RecipeConversion/DataStructures/ingredient';
import {getAuth} from 'firebase/auth';

const ADMIN_USER_UID = 'todo - fill this in';

let firebaseInitialized = false;
let globalDb = null;
let globalApp = null;
let globalAnalytics = null;

let globalUser = null;
let globalCredential = null;
let globalToken = null;

export const globalFirebaseManager = {
  initialize: function(dispatch) {
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
    fetchIngredientsFromDb(globalDb, dispatch);

    const auth = getAuth();
    auth.onAuthStateChanged(function(user) {
      if (user) {
        globalFirebaseManager.userSignedIn(user, null, null, dispatch);
      }
    });
  },
  getDb: function() {
    return globalDb;
  },
  userSignedIn: function(user, credential, token, dispatch) {
    globalUser = user;
    globalCredential = credential;
    globalToken = token;
    fetchUserScopedIngredients(globalDb, globalUser.uid, dispatch);
  },
  userSignedOut: function() {
    globalUser = null;
    globalCredential = null;
    globalToken == null;
  },

  getAuthDetails: function() {
    return [globalUser, globalCredential, globalToken];
  },
  getUser: function() {
    return globalUser;
  },
  isUserAdmin: function() {
    return globalUser != null && globalUser.uid == ADMIN_USER_UID;
  },
};
