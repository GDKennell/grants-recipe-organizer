import React, {useEffect} from 'react';
import {useState} from 'react';
import '../App.css';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {convertRecipe} from '../RecipeConversion/convertRecipe';
// Import the functions you need from the SDKs you need

// eslint-disable-next-line no-unused-vars
import {allHardCodedRecipes} from '../RecipeConversion/DataStructures/hardCodedRecipes';
import RecipeInputForm from '../Components/RecipeInputForm';
import RecipeDropDown from '../Components/RecipeDropDown';
import useFirebase from '../hooks/useFirebase';
import {ingredientTextKey, makeRecipe, recipeManualEditTextKey, recipeNameKey, recipeTextKey} from '../RecipeConversion/DataStructures/Recipe';
import {saveOrUpdateUserRecipe} from '../Database';
import {useLocation} from 'react-router-dom';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const outputTypeAutomatic='AutomaticRecipe';
const outputTypeManualEdit='ManualEdit';
const outputTypeBoth='both';

const titleKey = 'titleKey';
const ingredientKey = 'ingKey';
const recipeKey = 'recKey';

function RecipeConversion() {
  const minRows = 5;

  const location = useLocation();
  const linkedRecipe = location.state && location.state.linkedRecipe;
  // console.log(`RecipeConversion render. state: ${JSON.stringify(location.state)}`);
  useEffect(() => {
    if (!linkedRecipe) {
      return;
    }
    recipeChangedFn(linkedRecipe[recipeNameKey],
        linkedRecipe[ingredientTextKey],
        linkedRecipe[recipeTextKey],
        linkedRecipe[recipeManualEditTextKey]);
  }, [linkedRecipe]);

  const {firebaseDb, firebaseUser} = useFirebase();
  const saveEnabled = (firebaseUser != null);
  const {ingredientManager, userRecipesList} = useIngredientsStore();
  const [autoConvertedOutputText, setAutoConvertedOutputText] = useState('');
  const [manualEditedOutputText, setManualEditedOutputText] = useState('');
  const [manualEditing, setManualEditing] = useState(false);
  const [outputType, setOutputType] = useState(outputTypeAutomatic);
  const [ingredientListText, setIngredientListText] = useState(JSON.parse(localStorage.getItem(ingredientKey)) || '');
  const [recipeText, setRecipeText] = useState(JSON.parse(localStorage.getItem(recipeKey)) || '');
  const [recipeTitle, setRecipeTitle] = useState(JSON.parse(localStorage.getItem(titleKey)) || '');

  // useEffect(() => {
  //   console.log(`useeffect anth changed -> recipeChangedFn`);

  //   recipeChangedFn(recipeTitle, ingredientListText, recipeText);
  // }, [ingredientManager]);

  const autoConvertedOutputTextChange = (event) => {
    const textInput = event.target.value;
    setManualEditedOutputText(textInput);
    setManualEditing(textInput != autoConvertedOutputText);
    setOutputType((oldType) => {
      return oldType == outputTypeAutomatic ? outputTypeManualEdit : oldType;
    });
  };

  const [outputNumRows, setOutputNumRows] = useState(minRows);
  const recipeChangedFn = (title, ingredientsText, recipeText, recipeManualEditText) => {
    setRecipeTitle(title);
    setIngredientListText(ingredientsText);
    setRecipeText(recipeText);
    localStorage.setItem(titleKey, JSON.stringify(title));
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
    if (recipeManualEditText) {
      setManualEditedOutputText(recipeManualEditText);
    }
  };

  const ingredientsChangedFn = (newIngredientsText) => {
    setIngredientListText(newIngredientsText);
    recipeChangedFn(recipeTitle, newIngredientsText, recipeText);
  };

  const recipeStepsChangedFn = (newRecipeSteps) => {
    setRecipeText(newRecipeSteps);
    recipeChangedFn(recipeTitle, ingredientListText, newRecipeSteps);
  };

  const titleChangedFn = (newTitle) => {
    setRecipeTitle(newTitle);
    recipeChangedFn(newTitle, ingredientListText, recipeText);
  };

  const savePressed = () => {
    if (recipeTitle.length == 0) {
      alert('Please enter a recipe name to save');
      return;
    }
    const newRecipe = makeRecipe(recipeTitle, ingredientListText, recipeText, manualEditedOutputText);
    saveOrUpdateUserRecipe(newRecipe, firebaseDb, firebaseUser);
  };


  return (
    <div className="App">
      <div className="root-container">
        <h1 className="title"> Recipe Converter </h1>
        <RecipeDropDown recipes={allHardCodedRecipes}
          recipeSelected={recipeChangedFn}
          listName="Preset Recipes"/>
        {
          (userRecipesList.length > 0) &&
        <RecipeDropDown recipes={userRecipesList}
          recipeSelected={recipeChangedFn}
          listName="My Recipes" />
        }
        <RecipeInputForm recipeStepsChangedFn={recipeStepsChangedFn}
          ingredientsChangedFn={ingredientsChangedFn}
          titleChangedFn={titleChangedFn}
          initIngredientsText={ingredientListText}
          initRecipeText={recipeText}
          initTitleText={recipeTitle}/>
        <h3 className="instructions"> Converted Recipe:</h3>
        <button onClick={savePressed} disabled={!saveEnabled}>Save Recipe</button>
        <div className='horz-collection'>
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
        </div>
        <div className="recipe-output-container">
          <div>
            {(outputType == outputTypeBoth) && <b>Manually Edited</b>}
            <textarea
              className="main-recipe input-field"
              onChange={autoConvertedOutputTextChange}
              rows={outputNumRows}
              value={outputType == outputTypeAutomatic ? autoConvertedOutputText : manualEditedOutputText }
            ></textarea>
          </div>
          {(outputType == outputTypeBoth) &&
                <div>
                  <b>Auto-generated</b>
                  <textarea
                    className="main-recipe input-field"
                    onChange={autoConvertedOutputTextChange}
                    rows={outputNumRows}
                    value={ autoConvertedOutputText }
                  ></textarea>
                </div>
          }
        </div>

      </div>
    </div>
  );
}

export default RecipeConversion;
