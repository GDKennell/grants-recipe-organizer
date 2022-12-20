import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import {getAuth} from 'firebase/auth';
import {getAnalytics} from 'firebase/analytics';
import {fetchIngredientsFromDb, fetchUserScopedIngredients} from '../Database';


const useFirebase = (dispatch, ingredientsManager) => {
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [firebaseAnalytics, setFirebaseAnalytics] = useState(null);
  const [firebaseDb, setFirebaseDb] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

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
    const localFirebaseApp = initializeApp(firebaseConfig);
    const localFirebaseAnalytics = getAnalytics(localFirebaseApp);
    // Initialize Cloud Firestore and get a reference to the service
    const localFirebaseDb = getFirestore(localFirebaseApp);
    setFirebaseApp(localFirebaseApp);
    setFirebaseDb(localFirebaseDb);
    setFirebaseAnalytics(localFirebaseAnalytics);

    const auth = getAuth();
    auth.onAuthStateChanged(function(user) {
      setFirebaseUser(user);
      if (user) {
        fetchUserScopedIngredients(localFirebaseDb, user.uid, dispatch);
      }
    });
    fetchIngredientsFromDb(localFirebaseDb, dispatch, ingredientsManager);
  }, []);
  return {firebaseApp, firebaseAnalytics, firebaseDb, firebaseUser};
};

export default useFirebase;

