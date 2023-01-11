import {doc, getDoc, updateDoc, setDoc} from 'firebase/firestore';
import {userEmailKey, userNameKey, usersCollection} from '../DatabaseConstants';
import {objectsEqual} from '../RecipeConversion/utilities/stringHelpers';


function metadataFromUser(user) {
  const obj = {};
  obj[userEmailKey] = user.email;
  obj[userNameKey] = user.displayName;
  return obj;
}
function userMetadataFromDoc(doc) {
  const obj = {};
  obj[userEmailKey] = doc.data()[userEmailKey];
  obj[userNameKey] = doc.data()[userNameKey];
  return obj;
}

function docMatchesUser(doc, user) {
  return objectsEqual(metadataFromUser(user), userMetadataFromDoc(doc));
}

export async function storeUserData(db, user) {
  if (!user) {
    return;
  }
  const userDocRef = doc(db, usersCollection, user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    if (!docMatchesUser(userDocSnap, user)) {
      console.log(`User exists but wrong data: ${userMetadataFromDoc(userDocSnap)}`);
      await updateDoc(userDocRef, metadataFromUser(user));
    }
  } else {
    const docData = metadataFromUser(user);
    setDoc(userDocRef, docData).then(() => {
      console.log('Document has been added successfully');
    })
        .catch((error) => {
          console.error(error);
        });
  }
}

