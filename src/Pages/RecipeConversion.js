import React, {useEffect} from 'react';
import {useState} from 'react';
import '../App.css';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {convertRecipe} from '../RecipeConversion/convertRecipe';
// Import the functions you need from the SDKs you need

// eslint-disable-next-line no-unused-vars
import {allHardCodedRecipes, getRecipeByName, ingredientTextKey, recipeNameKey, recipeTextKey} from '../RecipeConversion/DataStructures/hardCodedRecipes';
import RecipeInputForm from '../Components/RecipeInputForm';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const outputTypeAutomatic='AutomaticRecipe';
const outputTypeManualEdit='ManualEdit';
const outputTypeBoth='both';

const ingredientKey = 'ingKey';
const recipeKey = 'recKey';

function RecipeConversion() {
  const minRows = 5;

  const {ingredientManager} = useIngredientsStore();
  const [autoConvertedOutputText, setAutoConvertedOutputText] = useState('');
  const [manualEditedOutputText, setManualEditedOutputText] = useState('');
  const [manualEditing, setManualEditing] = useState(false);
  const [outputType, setOutputType] = useState(outputTypeAutomatic);
  const [ingredientListText, setIngredientListText] = useState(JSON.parse(localStorage.getItem(ingredientKey)) || '');
  const [recipeText, setRecipeText] = useState(JSON.parse(localStorage.getItem(recipeKey)) || '');

  useEffect(() => {
    recipeChangedFn(ingredientListText, recipeText);
  }, [ingredientListText, recipeText]);

  const autoConvertedOutputTextChange = (event) => {
    const textInput = event.target.value;
    console.log(`converted text changed`);
    setManualEditedOutputText(textInput);
    setManualEditing(textInput != autoConvertedOutputText);
    setOutputType((oldType) => {
      return oldType == outputTypeAutomatic ? outputTypeManualEdit : oldType;
    });
  };

  const [outputNumRows, setOutputNumRows] = useState(minRows);
  const recipeChangedFn = (ingredientsText, recipeText) => {
    localStorage.setItem(ingredientKey, JSON.stringify(ingredientsText));
    localStorage.setItem(recipeKey, JSON.stringify(recipeText));

    const newValue = convertRecipe(ingredientsText, recipeText, ingredientManager);
    setAutoConvertedOutputText((oldConvertedText) => {
      if (oldConvertedText != newValue) {
        if (!manualEditing || confirm('Do you want to overwrite your manual edits?')) {
          setManualEditedOutputText(newValue);
          setManualEditing(false);
          setOutputType((oldType) => (oldType == outputTypeManualEdit ? outputTypeAutomatic : oldType));
        }
      }
      return newValue;
    });
    setOutputNumRows(Math.max(minRows, newValue.split('\n').length));
  };

  const ingredientsChangedFn = (newIngredientsText) => {
    setIngredientListText(newIngredientsText);
    recipeChangedFn(newIngredientsText, recipeText);
  };

  const recipeStepsChangedFn = (newRecipeSteps) => {
    setRecipeText(newRecipeSteps);
    recipeChangedFn(ingredientListText, newRecipeSteps);
  };

  const savePressed = () => {
    console.log(`Save recipe`);
  };
  const presetSelectChange = (arg) => {
    const selectedName = arg.target.value;
    const recipe = getRecipeByName(selectedName);
    setIngredientListText(recipe[ingredientTextKey]);
    setRecipeText(recipe[recipeTextKey]);
  };
  return (
    <div className="App">
      <div className="root-container">
        <h1 className="title"> Recipe Converter </h1>
        <select onChange={presetSelectChange}>
          <option value="" disabled selected>Preset Recipe</option>
          {allHardCodedRecipes.map((recipe) => {
            return <option key={recipe[recipeNameKey]}> {recipe[recipeNameKey]}</option>;
          })}
        </select>
        <RecipeInputForm recipeStepsChangedFn={recipeStepsChangedFn}
          ingredientsChangedFn={ingredientsChangedFn}
          initIngredientsText={ingredientListText}
          initRecipeText={recipeText}/>
        <h3 className="instructions"> Converted Recipe:</h3>
        <button onClick={savePressed}>Save Recipe</button>
        <button disabled={outputType == outputTypeManualEdit}
          onClick={ () => {
            setOutputType(outputTypeManualEdit);
          }}>Manually Edited</button>
        <button disabled={outputType == outputTypeAutomatic}
          onClick={ () => {
            setOutputType(outputTypeAutomatic);
          }}>Auto Generated</button>
        <button disabled={outputType == outputTypeBoth}
          onClick={ () => {
            setOutputType(outputTypeBoth);
          }}>Both</button>

        <textarea
          className="main-recipe input-field"
          onChange={autoConvertedOutputTextChange}
          rows={outputNumRows}
          value={outputType == outputTypeAutomatic ? autoConvertedOutputText : manualEditedOutputText }
        ></textarea>
        {(outputType == outputTypeBoth) &&
        <textarea
          className="main-recipe input-field"
          onChange={autoConvertedOutputTextChange}
          rows={outputNumRows}
          value={ autoConvertedOutputText }
        ></textarea>}

      </div>
    </div>
  );
}

export default RecipeConversion;
