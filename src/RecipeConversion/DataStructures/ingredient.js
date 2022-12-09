import {collection, addDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';
import {allHardCodedIngredients} from './hardCodedIngredients';


export function Ingredient(names, gramsPerCup) {
  this.names = names;
  this.gramsPerCup = gramsPerCup;
}


async function storeIngredientToDb(ingredient, db) {
  try {
    await addDoc(collection(db, 'ingredients'), {
      names: ingredient.names,
      gramsPerCupt: ingredient.gramsPerCup,
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
      if (doc.data().names != undefined ) {
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

const ingredients = allHardCodedIngredients;
const allIngredientNameStrings =ingredients
    .flatMap((m) => m.names)
    .map((m) => m.toLocaleLowerCase());

const allIngredientWords = allIngredientNameStrings.flatMap((m) =>
  m.toLocaleLowerCase().split(' '),
);

const nameToIngredient = {};
for (const ingredient of allHardCodedIngredients) {
  for (const name of ingredient.names) {
    nameToIngredient[name.toLocaleLowerCase()] = ingredient;
  }
}

export const globalIngredientManager = {
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
};


// ingredientManager
