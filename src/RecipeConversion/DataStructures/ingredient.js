import {cleanIngredientWord} from '../utilities/stringHelpers';

export function Ingredient(names, gramsPerCup) {
  this.names = names;
  this.gramsPerCup = gramsPerCup;
  this.key = names.join(',') + gramsPerCup;
}

export function isIngredientOwned(ingredient, firebaseUser) {
  return firebaseUser != null &&
  ingredient.isGlobal == false &&
  ingredient.userId == firebaseUser.uid;
}

export function makeIngredientObject(names, gramsPerCup, isGlobal, userId) {
  const finalNames = names.map((name) => cleanIngredientWord(name));
  return {
    names: finalNames,
    gramsPerCup: gramsPerCup,
    key: names.join(',') + gramsPerCup,
    isGlobal: isGlobal,
    userId: userId,
  };
}

export function ingredientFromDoc(doc, isGlobal, userId) {
  return makeIngredientObject(
      doc.data().names,
      doc.data().gramsPerCup,
      isGlobal,
      userId);
}


let numManagers = 0;
export class IngredientManager {
  constructor(ingredientList) {
    numManagers++;
    console.log(`creating IngredientManager #${numManagers}`);
    this.ingredientList = ingredientList || [];

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
    const localIngredients = [...this.ingredientList];
    localIngredients.sort( (left, right) => {
      const l = left.names[0].toLocaleLowerCase();
      const r = right.names[0].toLocaleLowerCase();
      return l.localeCompare(r);
    });
    this.ingredientList = localIngredients;
  }

  get getAllIngredients() {
    return this.ingredientList;
  }

  getUserScopedIngredients(firebaseUser) {
    if (firebaseUser == null || firebaseUser.uid == null) {
      return [];
    }
    return this.ingredientList.filter((ingredient) => {
      return !ingredient.isGlobal && ingredient.userId == firebaseUser.uid;
    });
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
