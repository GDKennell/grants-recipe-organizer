import {cleanIngredientWord, sanitizeIngredientName} from '../utilities/stringHelpers';

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

export function makeIngredientObject(names, gramsPerCup, isGlobal, userId, id) {
  const finalNames = names.map((name) => cleanIngredientWord(name));

  if (isGlobal == undefined) {
    isGlobal = true;
  }
  return {
    names: finalNames,
    gramsPerCup: gramsPerCup,
    key: names.join(',') + gramsPerCup,
    isGlobal: isGlobal,
    userId: userId,
    id: id,
  };
}

export function ingredientFromDoc(doc, isGlobal, userId) {
  return makeIngredientObject(
      doc.data().names,
      doc.data().gramsPerCup,
      isGlobal,
      userId,
      doc.id);
}


export class IngredientManager {
  constructor(ingredientList) {
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

  getUserScopedIngredientsByUserId(userId) {
    if (userId == null) {
      return [];
    }
    return this.ingredientList.filter((ingredient) => {
      return !ingredient.isGlobal && ingredient.userId == userId;
    });
  }

  getAllUserScopedIngredients() {
    return this.ingredientList.filter((ingredient) => {
      return !ingredient.isGlobal;
    });
  }

  isIngredientWord(str) {
    if (str == undefined || str == '') {
      return false;
    }
    return this.allIngredientWords.includes(str.toLocaleLowerCase());
  }

  isIngredientName(strIn) {
    const str = sanitizeIngredientName(strIn);
    return this.allIngredientNameStrings.includes(str);
  }

  findIngredientByName(ingredientName) {
    const str = sanitizeIngredientName(ingredientName);
    return this.nameToIngredient[str];
  }
};


// ingredientManager
