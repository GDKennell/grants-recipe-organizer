import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import {getAuth} from 'firebase/auth';
import {getAnalytics} from 'firebase/analytics';
import {fetchAllUserScopedIngredients, fetchIngredientsFromDb, fetchUserRecipesFromDb, fetchUserScopedIngredients, storeUserData} from '../Database';
import useIngredientsStore from './useIngredientsStore';
import {isUserAdmin} from '../Helpers/FirebaseManager';

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
const globalFirebaseApp = initializeApp(firebaseConfig);
let globalUserId = null;

const useFirebase = () => {
  const {ingredientManager, dispatch} = useIngredientsStore();
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [firebaseAnalytics, setFirebaseAnalytics] = useState(null);
  const [firebaseDb, setFirebaseDb] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    // Initialize Firebase
    const localFirebaseAnalytics = getAnalytics(globalFirebaseApp);
    // Initialize Cloud Firestore and get a reference to the service
    const localFirebaseDb = getFirestore(globalFirebaseApp);
    setFirebaseApp(globalFirebaseApp);
    setFirebaseDb(localFirebaseDb);
    setFirebaseAnalytics(localFirebaseAnalytics);

    const auth = getAuth();
    auth.onAuthStateChanged(function(user) {
      setFirebaseUser(user);
      fetchUserRecipesFromDb(localFirebaseDb, dispatch, user);
      if (user == null && globalUserId == null ||
        user.uid == globalUserId) {
        return;
      }
      globalUserId = (user == null) ? null : user.uid;

      storeUserData(localFirebaseDb, user);
      if (isUserAdmin(user)) {
        fetchAllUserScopedIngredients(localFirebaseDb, dispatch, ingredientManager);
      } else if (user) {
        fetchUserScopedIngredients(localFirebaseDb, user.uid, dispatch, ingredientManager);
      }
    });
    fetchIngredientsFromDb(localFirebaseDb, dispatch);
  }, []);
  return {firebaseApp, firebaseAnalytics, firebaseDb, firebaseUser};
};

export default useFirebase;


