
import {collection, getDocs, deleteDoc, doc, addDoc} from 'firebase/firestore';
import {addNewIngredients, replaceIngredientList} from './features/ingredientStore/ingredientStoreSlice';
import {allHardCodedIngredients} from './RecipeConversion/DataStructures/hardCodedIngredients';
import {ingredientFromDoc, makeIngredientObject} from './RecipeConversion/DataStructures/ingredient';
import {cleanIngredientWord} from './RecipeConversion/utilities/stringHelpers';


function isValidIngredientDoc(doc ) {
  if (doc.data().names == undefined || doc.data().names.length == 0) {
    return false;
  }
  if (isNaN(doc.data().gramsPerCup) ) {
    return false;
  }
  return true;
}

async function deleteIngredient(db, id) {
  try {
    await deleteDoc(doc(db, 'ingredients', id));
  } catch (e) {
    console.error('Error deleting documents: ', e);
  }
}


export async function fetchUserScopedIngredients(db, userId, dispatch) {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'PrivateIngredients' ));
  let numNew = 0;
  const localIngredients = [];
  try {
    querySnapshot.forEach((doc) => {
      if (isValidIngredientDoc(doc)) {
        const newIngredient = ingredientFromDoc(doc, /* isGlobal: */ false, userId);
        localIngredients.push(newIngredient);
        numNew++;
      } else {
        // Delete this duplicated ID from the actual DB
        console.log(`Bad ingredient with : ${doc.id} info: ${JSON.stringify(doc.data())} `);
      }
    });
    dispatch(addNewIngredients({newIngredients: localIngredients}));
    console.log(`Added ${numNew} new ingredients from private collection`);
  } catch (e) {
    console.error('Error fetching private documents: ', e);
  }
}

export async function fetchIngredientsFromDb(db, dispatch, ingredientManager) {
  if (ingredientManager != null &&
    ingredientManager.getAllIngredients!= null &&
    ingredientManager.getAllIngredients.length > 0) {
    return;
  }
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
        deleteIngredient(db, doc.id);
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


export async function addNewIngredient( names, gramsPerCup, firebaseDb, firebaseUser, dispatch, completion) {
  const db = firebaseDb;
  const userId = firebaseUser.uid;
  const finalNames = names.map((name) => cleanIngredientWord(name));
  try {
    await addDoc(collection(db, 'users', userId, 'PrivateIngredients' ), {
      names: finalNames,
      gramsPerCup: gramsPerCup,
    });
    console.log(`success adding document : ${finalNames} ${gramsPerCup}`);
    const newIngredients = [makeIngredientObject(finalNames, gramsPerCup, /* isGlobal: */ false, userId)];
    dispatch(addNewIngredients({newIngredients: newIngredients}));
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
  console.log('here we go');
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
