import React, {useEffect, useState} from 'react';

// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';


import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import useIngredientsStore from '../hooks/useIngredientsStore';
import useFirebase from '../hooks/useFirebase';
import {userSignedOut} from '../features/ingredientStore/ingredientStoreSlice';


const signedOutMessage = 'Not Signed In';
export default function LoginPage() {
  const {dispatch} = useIngredientsStore();
  const {firebaseUser} = useFirebase();
  const isUserSignedIn = (firebaseUser != null);
  const [loginMessage, setLoginMessage] = useState(signedOutMessage);

  useEffect(() => {
    if (firebaseUser != null ) {
      setLoginMessage(`Welcome ${firebaseUser.displayName}!`);
    } else {
      setLoginMessage(signedOutMessage);
    }
  }, [firebaseUser]);

  const signIn = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
          console.log('Login success');
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(`Error, got:  errorCode : ${errorCode}   errorMessage : ${errorMessage}   email : ${email}   credential : ${credential}  `);
          setLoginMessage('Login failed \n' + JSON.stringify(error));
          // ...
        });
  };
  const signOut = () => {
    getAuth().signOut().then(() => {
      console.log(`user signed out successfully`);
      dispatch(userSignedOut());
    }).catch((error) => {
      setLoginMessage(`Failed to sign out ${error}`);
    });
  };
  return (
    <div>
      <h1>Login</h1>
      {isUserSignedIn ?
      <button onClick={signOut}> Sign Out</button> :
      <button onClick={signIn}> Sign In</button>
      }
      <div> {loginMessage} </div>
    </div>
  );
}
