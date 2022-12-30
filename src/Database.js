
import {collection, getDocs, deleteDoc, doc, addDoc, updateDoc, getDoc, setDoc} from 'firebase/firestore';
import {addNewIngredients, deleteIngredient, ingredientUpdated, replaceIngredientList} from './features/ingredientStore/ingredientStoreSlice';
import {allHardCodedIngredients} from './RecipeConversion/DataStructures/hardCodedIngredients';
import {ingredientFromDoc, makeIngredientObject} from './RecipeConversion/DataStructures/ingredient';
import {cleanIngredientWord, objectsEqual} from './RecipeConversion/utilities/stringHelpers';


function isValidIngredientDoc(doc ) {
  if (doc.data().names == undefined || doc.data().names.length == 0) {
    return false;
  }
  if (isNaN(doc.data().gramsPerCup) ) {
    return false;
  }
  return true;
}

async function deleteGlobalIngredient(db, id) {
  try {
    await deleteDoc(doc(db, 'ingredients', id));
  } catch (e) {
    console.error('Error deleting documents: ', e);
  }
}

const userEmailKey = 'user-email';
const userNameKey = 'user-name';
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
  const userDocRef = doc(db, 'users', user.uid);
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

export async function fetchUserScopedIngredients(db, userId, dispatch, ingredientManager) {
  if (ingredientManager.getUserScopedIngredientsByUserId(userId).length > 0) {
    return;
  }

  const querySnapshot = await getDocs(collection(db, 'users', userId, 'PrivateIngredients' ));
  const localIngredients = [];
  try {
    querySnapshot.forEach((doc) => {
      if (isValidIngredientDoc(doc)) {
        const newIngredient = ingredientFromDoc(doc, /* isGlobal: */ false, userId);
        localIngredients.push(newIngredient);
      } else {
        // Delete this duplicated ID from the actual DB
        console.log(`Bad ingredient with : ${doc.id} info: ${JSON.stringify(doc.data())} `);
      }
    });
    dispatch(addNewIngredients({newIngredients: localIngredients}));
  } catch (e) {
    console.error('Error fetching private documents: ', e);
  }
}

const userIdToName = {};
export function getNameForUserId(userId, fallback) {
  return (!userId) ? fallback : userIdToName[userId];
}

async function fetchUserName(db, userId) {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);
  const userName = userDocSnap.data()[userNameKey];
  userIdToName[userId] = userName;
}

export async function promoteIngredient(db, dispatch, ingredient) {
  const newIngredient = makeIngredientObject(ingredient.names, ingredient.gramsPerCup, /* isGlobal */ true, /* userId */ null, /* id*/ null);
  dispatch(addNewIngredients({newIngredients: [newIngredient]}));
  try {
    await addDoc(collection(db, 'ingredients'), {
      names: ingredient.names,
      gramsPerCup: ingredient.gramsPerCup,
    });
    console.log(`success adding global ingredient : ${ingredient.names} / ${ingredient.gramsPerCup}`);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function fetchAllUserScopedIngredients(db, dispatch, ingredientManager) {
  if (ingredientManager.getAllUserScopedIngredients().length > 0 ) {
    return;
  }
  try {
    let numUsers = 0;
    const usersQuerySnapshot = await getDocs(collection(db, 'users' ));
    usersQuerySnapshot.forEach((userDoc) => {
      console.log(`admin: Going to try to fetch data for ${userDoc.id} #${numUsers}`);
      numUsers++;
      fetchUserScopedIngredients(db, userDoc.id, dispatch, ingredientManager);
      fetchUserName(db, userDoc.id);
    });
    console.log(`admin: fetched data for ${numUsers} users`);
  } catch (e) {
    console.error('Error fetching user documents: ', e);
  }
}

let dbFetchStarted = false;

export async function fetchIngredientsFromDb(db, dispatch) {
  if (dbFetchStarted) {
    return;
  }
  dbFetchStarted = true;
  console.log(`Going to fetch`);

  try {
    // TODO: don't overwrite list if DB fetch fails
    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    const localIngredients = [];
    const allNames = [];
    querySnapshot.forEach((doc) => {
      const namesKey = doc.data().names ? doc.data().names.join('---') : null;
      if (!allNames.includes(namesKey) && isValidIngredientDoc(doc)) {
        localIngredients.push(ingredientFromDoc(doc, /* isGlobal: */ true, /* userId:  */ null));
        allNames.push(namesKey);
      } else {
        // Delete this duplicated ID from the actual DB
        console.log(`delet dis: ${doc.id}`);
        deleteGlobalIngredient(db, doc.id);
      }
    });
    if (localIngredients.length > 0 ) {
      console.log(`Successfully fetched : ${localIngredients.length} ingredients`);
      dispatch(replaceIngredientList({newIngredientList: localIngredients}));
    }
  } catch (e) {
    console.error('Error fetching documents: ', e);
  }
}

export async function updateIngredient(oldIngredient,
    newIngredient,
    firebaseUser,
    firebaseDb,
    dispatch,
    completion) {
  const userId = firebaseUser.uid;

  const updateDict = {names: newIngredient.names,
    gramsPerCup: newIngredient.gramsPerCup};
  try {
    dispatch(ingredientUpdated({updatedIngredient: newIngredient}));
    let docRef;
    if (newIngredient.isGlobal) {
      docRef = doc(firebaseDb, 'ingredients', oldIngredient.id);
    } else {
      docRef = doc(firebaseDb, 'users', userId, 'PrivateIngredients', oldIngredient.id);
    }
    await updateDoc(docRef, updateDict);
    console.log(`Successfully updated ingredient ${JSON.stringify(updateDict)}`);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
}

export async function deleteIngredientFromDb( ingredient, firebaseDb, firebaseUser, dispatch, completion) {
  const userId = firebaseUser.uid;
  if (!confirm(`Are you sure you want to delete ${ingredient.names[0]}?`)) {
    return;
  }
  try {
    dispatch(deleteIngredient({ingredientToDelete: ingredient}));

    let docRef;
    if (ingredient.isGlobal) {
      docRef = doc(firebaseDb, 'ingredients', ingredient.id);
    } else {
      docRef = doc(firebaseDb, 'users', userId, 'PrivateIngredients', ingredient.id);
    }
    await deleteDoc(docRef);
    console.log(`Successfully deleted document`);
    if (completion) {
      completion();
    }
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
}


export async function addNewIngredient( names, gramsPerCup, firebaseDb, firebaseUser, dispatch, completion) {
  const db = firebaseDb;
  const userId = firebaseUser.uid;
  const finalNames = names.map((name) => cleanIngredientWord(name));
  try {
    const newIngredients = [makeIngredientObject(finalNames, gramsPerCup, /* isGlobal: */ false, userId)];
    dispatch(addNewIngredients({newIngredients: newIngredients}));

    await addDoc(collection(db, 'users', userId, 'PrivateIngredients' ), {
      names: finalNames,
      gramsPerCup: gramsPerCup,
    });
    // console.log(`success adding document : ${finalNames} ${gramsPerCup}`);
    completion();
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}


async function storeIngredientToDb(ingredient, db) {
  try {
    await addDoc(collection(db, 'ingredients'), {
      names: ingredient.names,
      gramsPerCup: ingredient.gramsPerCup,
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function writeToDb(db) {
  const allDbNames = [];
  let numDocs = 0;
  try {
    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    querySnapshot.forEach((doc) => {
      if (doc.data().gramsPerCup != undefined ) {
        numDocs ++;
        doc.data().names.forEach((name) => {
          allDbNames.push(name);
        });
      } else {
        console.log(`Got a bad doc with id ${doc.id}`);
        deleteIngredient(db, doc.id);
      }
    });
    console.log(allDbNames);
    console.log(`have ${numDocs } docs`);
    allHardCodedIngredients.forEach((ingredient) => {
      if (!allDbNames.includes(ingredient.names[0])) {
        storeIngredientToDb(ingredient, db);
      }
    });
  } catch (e) {
    console.error('Error reading documents: ', e);
  }
}
