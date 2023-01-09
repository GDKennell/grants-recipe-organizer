
import {collection, getDocs, deleteDoc, doc, addDoc, updateDoc, getDoc, setDoc} from 'firebase/firestore';
import {globalRecipesCollection, ingredientsCollection, privateIngredientsCollection, privateRecipesCollection, userEmailKey, userNameKey, usersCollection} from './DatabaseConstants';
import {addNewIngredients, deleteIngredient, ingredientUpdated, replaceGlobalRecipesList, replaceIngredientList, replaceUserRecipesList} from './features/ingredientStore/ingredientStoreSlice';
import {allHardCodedIngredients} from './RecipeConversion/DataStructures/hardCodedIngredients';
import {ingredientFromDoc, makeIngredientObject} from './RecipeConversion/DataStructures/ingredient';
import {prepRecipeForDb, recipeFromDoc, recipeNameKey} from './RecipeConversion/DataStructures/Recipe';
import {cleanIngredientWord, objectsEqual} from './RecipeConversion/utilities/stringHelpers';


function isValidIngredientDoc(doc) {
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
    await deleteDoc(doc(db, ingredientsCollection, id));
  } catch (e) {
    console.error('Error deleting documents: ', e);
  }
}

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

export async function fetchUserScopedIngredients(db, userId, dispatch, ingredientManager) {
  if (ingredientManager.getUserScopedIngredientsByUserId(userId).length > 0) {
    return;
  }

  const querySnapshot = await getDocs(collection(db, usersCollection, userId, privateIngredientsCollection ));
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
  const userDocRef = doc(db, usersCollection, userId);
  const userDocSnap = await getDoc(userDocRef);
  const userName = userDocSnap.data()[userNameKey];
  userIdToName[userId] = userName;
}

export async function promoteIngredient(db, dispatch, ingredient) {
  const newIngredient = makeIngredientObject(ingredient.names, ingredient.gramsPerCup, /* isGlobal */ true, /* userId */ null, /* id*/ null);
  dispatch(addNewIngredients({newIngredients: [newIngredient]}));
  try {
    await addDoc(collection(db, ingredientsCollection), {
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
    const usersQuerySnapshot = await getDocs(collection(db, usersCollection ));
    usersQuerySnapshot.forEach((userDoc) => {
      fetchUserScopedIngredients(db, userDoc.id, dispatch, ingredientManager);
      fetchUserName(db, userDoc.id);
    });
  } catch (e) {
    console.error('Error fetching user documents: ', e);
  }
}

let dbIngredientFetchStarted = false;

export async function fetchIngredientsFromDb(db, dispatch) {
  if (dbIngredientFetchStarted) {
    return;
  }
  dbIngredientFetchStarted = true;

  try {
    // TODO: don't overwrite list if DB fetch fails
    const querySnapshot = await getDocs(collection(db, ingredientsCollection));
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
      dispatch(replaceIngredientList({newIngredientList: localIngredients}));
    }
  } catch (e) {
    console.error('Error fetching ingredients: ', e);
  }
}


let userIdFetched = null;
let globalFetched = false;
export async function fetchRecipesFromDb(db, dispatch, user) {
  if (user && userIdFetched == user.uid ||
    !user && globalFetched) {
    return;
  }
  userIdFetched = user ? user.uid : userIdFetched;
  globalFetched = !user ? true : globalFetched;

  try {
    const recipeCollection = (user == null) ? collection(db, globalRecipesCollection) :
        collection(db, usersCollection, user.uid, privateRecipesCollection );
    const querySnapshot = await getDocs(recipeCollection);
    const localRecipes = [];
    querySnapshot.forEach((doc) => {
      localRecipes.push(recipeFromDoc(doc));
    });
    if (localRecipes.length > 0 && user) {
      dispatch(replaceUserRecipesList({newUserRecipes: localRecipes}));
    } else if (localRecipes.length > 0 ) {
      dispatch(replaceGlobalRecipesList({newGlobalRecipes: localRecipes}));
    }
  } catch (e) {
    console.error('Error fetching recipes: ', e);
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
      docRef = doc(firebaseDb, ingredientsCollection, oldIngredient.id);
    } else {
      docRef = doc(firebaseDb, usersCollection, userId, privateIngredientsCollection, oldIngredient.id);
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
      docRef = doc(firebaseDb, ingredientsCollection, ingredient.id);
    } else {
      docRef = doc(firebaseDb, usersCollection, userId, privateIngredientsCollection, ingredient.id);
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

    await addDoc(collection(db, usersCollection, userId, privateIngredientsCollection ), {
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
    await addDoc(collection(db, ingredientsCollection), {
      names: ingredient.names,
      gramsPerCup: ingredient.gramsPerCup,
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function findRecipeDocIdByName(recipeCollection, recipeName ) {
  const querySnapshot = await getDocs(recipeCollection);
  let recipeId = null;
  querySnapshot.forEach((doc) => {
    const dbRecipe = recipeFromDoc(doc);
    if (dbRecipe[recipeNameKey] == recipeName) {
      recipeId = doc.id;
    }
  });
  return recipeId;
}

async function recipeDoc(recipeId, db, user) {
  let docRef;
  if (user) {
    docRef = doc(db, usersCollection, user.uid, privateRecipesCollection, recipeId);
  } else {
    docRef = doc(db, globalRecipesCollection, recipeId);
  }
  return docRef;
}

async function updateExistingRecipe(recipeId, recipeIn, db, user) {
  if (!confirm(`Are you sure you want to overwrite saved recipe ${recipeIn[recipeNameKey]}?`)) {
    return;
  }
  const docRef = await recipeDoc(recipeId, db, user);
  try {
    await updateDoc(docRef, recipeIn);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
  alert(`Successfully updated recipe ${recipeIn[recipeNameKey]}`);
}

async function addNewRecipe(recipeIn, recipeCollection, db, user) {
  try {
    await addDoc(recipeCollection, recipeIn);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
  console.log(`Successfully added new recipe ${recipeIn[recipeNameKey]}`);
  alert(`Successfully saved new recipe ${recipeIn[recipeNameKey]}`);
}

export async function saveOrUpdateRecipe(recipeIn, db, user) {
  const newRecipe = prepRecipeForDb(recipeIn);
  try {
    const recipeCollection = (user == null) ? collection(db, globalRecipesCollection) :
        collection(db, usersCollection, user.uid, privateRecipesCollection );

    const recipeId = await findRecipeDocIdByName(recipeCollection, newRecipe[recipeNameKey]);
    if (recipeId == null) {
      await addNewRecipe(newRecipe, recipeCollection, db, user);
    } else {
      await updateExistingRecipe(newRecipe, newRecipe, db, user);
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function writeToDb(db) {
  const allDbNames = [];
  let numDocs = 0;
  try {
    const querySnapshot = await getDocs(collection(db, ingredientsCollection));
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
