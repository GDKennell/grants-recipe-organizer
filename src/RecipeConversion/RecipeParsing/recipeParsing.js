import { findIngredientName } from "./ingredientParsing";
import { removeSimpleLines } from "./recipePostProcessing";

import { findVolumeStringBefore } from "./volumeParsing";

import {
    insertNewLinesAround,
    isLineAllWhitespace,
    stringContains,
    strInsert,
    strRemoveRange,
} from "../utilities/stringHelpers";
import { convertFractionsToDecimals } from "../utilities/numberConversion";

export function parseRecipe(recipeStringIn, measuredIngredients) {
    var recipe = recipeStringIn.replaceAll(".", "\n");
    recipe = recipe.replaceAll(",", " ,");
    recipe = recipe.replaceAll("\n", " \n ");
    recipe = convertFractionsToDecimals(recipe);

    // Todo: pre-process removing all double spaces (should only be single spaces)

    recipe = putIngredientsOnOwnLine(recipe);
    recipe = addAndConvertIngredientUnits(recipe, measuredIngredients);
    recipe = removeSimpleLines(recipe);
    recipe = removeRedundantWords(recipe);
    recipe = moveCommaListsToBulletOnes(recipe);
    recipe = insertMultiLineStepMarkers(recipe);
    return recipe;
}

function addAndConvertIngredientUnits(recipeStringIn, measuredIngredients) {
    if (measuredIngredients == undefined) {
        return recipeStringIn;
    }
    var nameToMeasured = {};
    for (const measuredIngredient of measuredIngredients) {
        for (const name of measuredIngredient.ingredient.names) {
            nameToMeasured[name.toLocaleLowerCase()] = measuredIngredient;
            nameToMeasured[name.toLocaleLowerCase() + "s"] = measuredIngredient;
        }
    }
    const lines = recipeStringIn.split("\n");
    var finalString = "";
    for (const line of lines) {
        const [ingredientName, ] = findIngredientName(line, 0);
        if (ingredientName == "") {
            finalString += line + "\n";
            continue;
        }
        const measuredIngredient = nameToMeasured[ingredientName];
        if (measuredIngredient == undefined) {
            finalString += line + "\n";
            continue;
        }
        var newLine = line;
        const startIndex = line.indexOf(ingredientName);
        newLine = strInsert(
            newLine,
            measuredIngredient.description() + " ",
            startIndex
        );
        finalString += newLine + "\n";
    }
    return finalString;
}

function putIngredientsOnOwnLine(recipeStringIn) {
    var recipe = recipeStringIn;
    // check each word if it's start of an ingredient
    var [ingredientName, ingredientEndIndex] = findIngredientName(recipe, 0);

    // TODO: handle case where false positive of ingredient word and need to backtrack to the next word
    // e.g. we have ingredients "unbleached flour" and "milk"
    // And text contains "unbleached milk". must still find milk
    while (ingredientName != "") {
        var ingredientStartIndex = ingredientEndIndex - ingredientName.length - 1;
        // TODO: swap this to findUnitMeasureString()
        const [volumeString, , ] = findVolumeStringBefore(
            recipe,
            ingredientName,
            ingredientStartIndex
        );
        if (volumeString != "") {
            ingredientStartIndex -= volumeString.length;
            ingredientName = volumeString + " " + ingredientName;
        }
        [recipe, ingredientEndIndex] = insertNewLinesAround(
            recipe,
            ingredientName,
            ingredientStartIndex
        );
        [ingredientName, ingredientEndIndex] = findIngredientName(
            recipe,
            ingredientEndIndex
        );
    }

    return recipe;
}

function removeRedundantWords(recipeStringIn) {
    const redundantWords = ["next", "then"];
    var recipe = recipeStringIn;
    for (const word of redundantWords) {
        var index = recipe.toLocaleLowerCase().indexOf(word);
        while (index != -1) {
            // Check if it's followed by [whitespace] [comma], if so include that
            // Remove this from the string
            var endIndex = index + word.length;
            while (stringContains(" ,", recipe[endIndex])) {
                endIndex++;
            }
            recipe = strRemoveRange(recipe, index, endIndex);
            index = recipe.toLocaleLowerCase().indexOf(word);
        }
    }
    return recipe;
}

function moveCommaListsToBulletOnes(recipeStringIn) {
    return recipeStringIn.replaceAll(",", "\n - - ");
}

function insertMultiLineStepMarkers(recipeStringIn) {
    const lines = recipeStringIn.split("\n");
    var finalLines = [];
    for (const line of lines) {
        if (!isLineAllWhitespace(line)) {
            finalLines.push("> " + line);
        } else {
            finalLines.push(line);
        }
    }
    return finalLines.join("\n");
}
