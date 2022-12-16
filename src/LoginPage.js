import React, {useState, useEffect} from 'react';

// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';


import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {globalFirebaseManager} from './FirebaseManager';
import useIngredientsStore from './hooks/useIngredientsStore';


export default function LoginPage() {
  const {dispatch} = useIngredientsStore();

  const [loginMessage, setLoginMessage] = useState('Not Signed In');
  const [isUserSignedIn, setIsUserSignedIn] = useState(globalFirebaseManager.getUser != null);

  const updateUserState = () => {
    const user = globalFirebaseManager.getUser();
    const isSignedIn = (user != null);
    setIsUserSignedIn(isSignedIn);
    if (isSignedIn) {
      setLoginMessage(`Welcome ${user.displayName}!`);
      globalFirebaseManager.userSignedIn(user, null, null, dispatch);
    } else {
      setLoginMessage('Not Signed In');
    }
  };

  useEffect(() => {
    updateUserState();
  }, []);
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
          globalFirebaseManager.userSignedIn(user, credential, token, dispatch);
          updateUserState();
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
      globalFirebaseManager.userSignedOut();
      updateUserState();
    }).catch((error) => {
      setLoginMessage(`Failed to sign out ${error}`);
    });
  };
  return (
    <div>
      <h1>Login</h1>
      {!isUserSignedIn && <button onClick={signIn}> Sign In</button>}
      {isUserSignedIn && <button onClick={signOut}> Sign Out</button>}
      <div> {loginMessage} </div>
    </div>
  );
}
