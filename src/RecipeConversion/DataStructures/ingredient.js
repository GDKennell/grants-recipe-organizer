import {collection, addDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';
import {globalFirebaseManager} from '../../FirebaseManager';
import {allHardCodedIngredients} from './hardCodedIngredients';
import {addNewIngredients, replaceIngredientList} from '../../features/counter/counterSlice';

export function Ingredient(names, gramsPerCup) {
  this.names = names;
  this.gramsPerCup = gramsPerCup;
  this.key = names.join(',') + gramsPerCup;
}

export function makeIngredientObject(names, gramsPerCup) {
  return {
    names: names,
    gramsPerCup: gramsPerCup,
    key: names.join(',') + gramsPerCup,
  };
}

function ingredientFromDoc(doc) {
  return makeIngredientObject(doc.data().names, doc.data().gramsPerCup);
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
async function deleteIngredient(db, id) {
  try {
    await deleteDoc(doc(db, 'ingredients', id));
  } catch (e) {
    console.error('Error deleting documents: ', e);
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

function isValidIngredientDoc(doc ) {
  if (doc.data().names == undefined || doc.data().names.length == 0) {
    return false;
  }
  if (isNaN(doc.data().gramsPerCup) ) {
    return false;
  }
  return true;
}

let dbFetched = false;

export async function fetchIngredientsFromDb(db, dispatch) {
  if (dbFetched) {
    return;
  }
  try {
    // TODO: don't overwrite list if DB fetch fails
    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    dbFetched = true;
    const localIngredients = [];
    const allNames = [];
    querySnapshot.forEach((doc) => {
      const namesKey = doc.data().names ? doc.data().names.join('---') : null;
      if (!allNames.includes(namesKey) && isValidIngredientDoc(doc)) {
        localIngredients.push(ingredientFromDoc(doc));
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

export async function fetchUserScopedIngredients(db, userId, dispatch) {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'PrivateIngredients' ));
  let numNew = 0;
  const localIngredients = [];
  try {
    querySnapshot.forEach((doc) => {
      if (isValidIngredientDoc(doc)) {
        const newIngredient = ingredientFromDoc(doc);
        localIngredients.push(newIngredient);
        console.log(`\tAdded new private ingredient: ${JSON.stringify(newIngredient)}`);
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


export async function addNewIngredient( names, gramsPerCup, dispatch) {
  const db = globalFirebaseManager.getDb();
  const userId = globalFirebaseManager.getUser().uid;
  try {
    await addDoc(collection(db, 'users', userId, 'PrivateIngredients' ), {
      names: names,
      gramsPerCup: gramsPerCup,
    });
    console.log(`success adding document : ${names} ${gramsPerCup}`);
    const newIngredients = [makeIngredientObject(names, gramsPerCup)];
    dispatch(addNewIngredients({newIngredients: newIngredients}));
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export class IngredientManager {
  constructor(ingredientList) {
    this.ingredientList = ingredientList;

    this.allIngredientNameStrings = this.ingredientList
        .flatMap((m) => m.names)
        .map((m) => m.toLocaleLowerCase());

    this.allIngredientWords = this.allIngredientNameStrings.flatMap((m) =>
      m.toLocaleLowerCase().split(' '),
    );

    this.nameToIngredient = {};
    for (const ingredient of this.ingredientList) {
      for (const name of ingredient.names) {
        this.nameToIngredient[name.toLocaleLowerCase()] = ingredient;
      }
    }
  }

  get getAllIngredients() {
    return this.ingredientList;
  }

  isIngredientWord(str) {
    if (str == undefined || str == '') {
      return false;
    }
    return this.allIngredientWords.includes(str.toLocaleLowerCase());
  }

  isIngredientName(strIn) {
    let str = strIn;
    if (str[str.length - 1] == ' ') {
      str = str.substring(0, str.length - 1);
    }
    return this.allIngredientNameStrings.includes(str.toLocaleLowerCase());
  }

  findIngredientByName(ingredientName) {
    return this.nameToIngredient[ingredientName];
  }
};


// ingredientManager
