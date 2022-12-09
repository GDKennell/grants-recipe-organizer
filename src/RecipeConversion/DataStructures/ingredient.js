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


export default class IngredientManager {
  constructor() {
    this.ingredients = allHardCodedIngredients;
    this. allIngredientNameStrings = this.ingredients
        .flatMap((m) => m.names)
        .map((m) => m.toLocaleLowerCase());
    this.allIngredientWords = this.allIngredientNameStrings.flatMap((m) =>
      m.toLocaleLowerCase().split(' '),
    );

    this.nameToIngredient = {};
    for (const ingredient of allHardCodedIngredients) {
      for (const name of ingredient.names) {
        this.nameToIngredient[name.toLocaleLowerCase()] = ingredient;
      }
    }
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
}

const ingredientManagerSingleton = new IngredientManager();
Object.freeze(ingredientManagerSingleton);

// export default ingredientManagerSingleton;

// ingredientManager
