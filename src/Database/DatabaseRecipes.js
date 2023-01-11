import {collection, getDocs, doc, getDoc, updateDoc, addDoc} from 'firebase/firestore';
import {useId} from 'react';
import {globalRecipesCollection, usersCollection, privateRecipesCollection, publicUserId} from '../DatabaseConstants';
import {replaceUserRecipesList, replaceGlobalRecipesList} from '../features/ingredientStore/ingredientStoreSlice';
import {recipeFromDoc, recipeDocIdKey, recipeNameKey, prepRecipeForDb, recipeIsPublicKey} from '../RecipeConversion/DataStructures/Recipe';

let userIdFetched = null;
let globalFetched = false;

// Key: `${userId}/${recipeId}`
// Value: Recipe object
const userAndRecipeIdToRecipe = {};
function storeRecipe(userId, recipeId, recipe) {
  userAndRecipeIdToRecipe[`${userId}/${recipeId}`] = recipe;
}
function getCachedRecipe(userId, recipeId) {
  return userAndRecipeIdToRecipe[`${userId}/${recipeId}`];
}

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
      const recipe = recipeFromDoc(doc);
      localRecipes.push(recipe);
      const userId = user ? user.uid : publicUserId;
      storeRecipe(userId, recipe[recipeDocIdKey], recipe);
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

export async function fetchSingleRecipeFromDb(db, userId, recipeId) {
  console.log(`fetchSingleRecipeFromDb(${db}, ${userId}, ${recipeId}`);
  const cachedRecipe = getCachedRecipe(useId, recipeId);
  if (cachedRecipe) {
    return cachedRecipe;
  }
  const recipeDocRef = doc(db, usersCollection, userId, privateRecipesCollection, recipeId);
  const recipeDoc = await getDoc(recipeDocRef);

  const recipe = recipeFromDoc(recipeDoc);
  storeRecipe(useId, recipeId, recipe);
  return recipe;
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
  if (!confirm(`Are you sure you want to overwrite saved recipe "${recipeIn[recipeNameKey]}"?`)) {
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

export async function makeRecipePublic(recipe, db, user) {
  if (!confirm(`Are you sure you want make "${recipe[recipeNameKey]}" public?`)) {
    return;
  }
  const newRecipe = recipe;
  newRecipe[recipeIsPublicKey] = true;
  await updateExistingRecipe(newRecipe[recipeDocIdKey], newRecipe, db, user);
}

export async function makeRecipePrivate(recipe, db, user) {
  if (!confirm(`Are you sure you want make "${recipe[recipeNameKey]}" private?`)) {
    return;
  }
  const newRecipe = recipe;
  newRecipe[recipeIsPublicKey] = false;
  await updateExistingRecipe(newRecipe[recipeDocIdKey], newRecipe, db, user);
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
