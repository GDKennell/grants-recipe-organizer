import React, {useEffect, useState} from 'react';

// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';


import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import useIngredientsStore from './hooks/useIngredientsStore';
import useFirebase from './hooks/useFirebase';
import {userSignedOut} from './features/ingredientStore/ingredientStoreSlice';


const signedOutMessage = 'Not Signed In';
export default function LoginPage() {
  const {dispatch, ingredientManager} = useIngredientsStore();
  const {firebaseUser} = useFirebase(dispatch, ingredientManager);
  const isUserSignedIn = (firebaseUser != null);
  const [loginMessage, setLoginMessage] = useState(signedOutMessage);

  useEffect(() => {
    console.log('LoginPage useEffect [firebaseUser]');
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
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(`Login succes. Got credential : ${credential}  token : ${token}  user : ${JSON.stringify(user)} `);
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
