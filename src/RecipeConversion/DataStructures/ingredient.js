import {collection, addDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';
import {allHardCodedIngredients} from './hardCodedIngredients';


export function Ingredient(names, gramsPerCup) {
  this.names = names;
  this.gramsPerCup = gramsPerCup;
  this.key = names.join(',') + gramsPerCup;
}

function ingredientFromDoc(doc) {
  return new Ingredient(doc.data().names, doc.data().gramsPerCup);
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
  await deleteDoc(doc(db, 'ingredients', id));
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

let ingredients = allHardCodedIngredients;
let allIngredientNameStrings;
let allIngredientWords;
let nameToIngredient = {};
let dbFetched = false;

function updateIngredientsMetadata() {
  allIngredientNameStrings =ingredients
      .flatMap((m) => m.names)
      .map((m) => m.toLocaleLowerCase());

  allIngredientWords = allIngredientNameStrings.flatMap((m) =>
    m.toLocaleLowerCase().split(' '),
  );

  nameToIngredient = {};
  for (const ingredient of allHardCodedIngredients) {
    for (const name of ingredient.names) {
      nameToIngredient[name.toLocaleLowerCase()] = ingredient;
    }
  }
}
updateIngredientsMetadata();

export const globalIngredientManager = {
  getAllIngredients: function() {
    return ingredients;
  },

  isIngredientWord: function(str) {
    if (str == undefined || str == '') {
      return false;
    }
    return allIngredientWords.includes(str.toLocaleLowerCase());
  },

  isIngredientName: function(strIn) {
    let str = strIn;
    if (str[str.length - 1] == ' ') {
      str = str.substring(0, str.length - 1);
    }
    return allIngredientNameStrings.includes(str.toLocaleLowerCase());
  },

  findIngredientByName: function(ingredientName) {
    return nameToIngredient[ingredientName];
  },

  fetchIngredientsFromDb: async function(db) {
    if (dbFetched) {
      return;
    }
    try {
    // TODO: don't overwrite list if DB fetch fails
      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const localIngredients = [];
      const allNames = [];
      querySnapshot.forEach((doc) => {
        dbFetched = true;
        const namesKey = doc.data().names ? doc.data().names.join('---') : null;
        if (doc.data().names != undefined && !allNames.includes(namesKey) && !isNaN(doc.data().gramsPerCup)) {
          localIngredients.push(ingredientFromDoc(doc));
          allNames.push(namesKey);
        } else {
        // Delete this duplicated ID from the actual DB
          console.log(`delet dis: ${doc.id}`);
        }
      });
      if (localIngredients.length > 0 ) {
        ingredients = localIngredients;
      }
    } catch (e) {
      console.error('Error fetching documents: ', e);
    }

    updateIngredientsMetadata();
  },
};


// ingredientManager
