import React, {useEffect} from 'react';
import {useState} from 'react';
import '../App.css';
import useIngredientsStore from '../hooks/useIngredientsStore';
import {combineIngredientsAndRecipe, convertRecipe} from '../RecipeConversion/convertRecipe';
// Import the functions you need from the SDKs you need

// eslint-disable-next-line no-unused-vars
import RecipeInputForm from '../Components/RecipeInputForm';
import RecipeDropDown from '../Components/RecipeDropDown';
import useFirebase from '../hooks/useFirebase';
import {ingredientTextKey, makeRecipe, recipeManualEditTextKey, recipeNameKey, recipeTextKey} from '../RecipeConversion/DataStructures/Recipe';
import {useLocation} from 'react-router-dom';
import {saveOrUpdateRecipe} from '../Database/DatabaseRecipes';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const outputTypeAutomatic='AutomaticRecipe';
const outputTypeManualEdit='ManualEdit';
const outputTypeBoth='both';

const titleKey = 'titleKey';
const ingredientKey = 'ingKey';
const recipeKey = 'recKey';


let ingMgrKey = '';

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
        linkedRecipe[recipeManualEditTextKey],
        /* brandNew= */ true);
  }, [linkedRecipe]);

  const {firebaseDb, firebaseUser} = useFirebase();
  const saveEnabled = (firebaseUser != null);
  const {ingredientManager,
    userRecipesList,
    globalRecipesList,
    dispatch} = useIngredientsStore();
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

  useEffect(() => {
    if (ingredientManager.key == ingMgrKey) {
      return;
    }
    ingMgrKey = ingredientManager.key;
    recipeChangedFn(recipeTitle,
        ingredientListText,
        recipeText,
        manualEditedOutputText,
        /* brandNew= */ false);
  }, [ingredientManager]);

  const [outputNumRows, setOutputNumRows] = useState(minRows);

  const autoTextChangedFn = (newAutoText) => {
    setAutoConvertedOutputText((oldConvertedText) => {
      if (oldConvertedText != newAutoText) {
        if (!manualEditing || confirm('Do you want to overwrite your manual edits?')) {
          setManualEditedOutputText(newAutoText);
          setManualEditing(false);
          console.log(`Back to auto`);
          setOutputType((oldType) => (oldType == outputTypeManualEdit ? outputTypeAutomatic : oldType));
        }
      }
      return newAutoText;
    });
  };
  const recipeChangedFn = (title, ingredientsText, recipeText, recipeManualEditText, brandNew) => {
    setRecipeTitle(title);
    setIngredientListText(ingredientsText);
    setRecipeText(recipeText);
    localStorage.setItem(titleKey, JSON.stringify(title));
    localStorage.setItem(ingredientKey, JSON.stringify(ingredientsText));
    localStorage.setItem(recipeKey, JSON.stringify(recipeText));

    const {ingredientsString, recipeString} = convertRecipe(ingredientsText, recipeText, ingredientManager);
    const newValue = combineIngredientsAndRecipe(ingredientsString, recipeString);
    if (brandNew) {
      const manualChanged = (newValue != recipeManualEditText);
      setManualEditing(true);
      setOutputType(manualChanged ? outputTypeBoth : outputTypeAutomatic);
    } else {
      autoTextChangedFn(newValue);
    }
    setOutputNumRows(Math.max(minRows, newValue.split('\n').length));
    if (recipeManualEditText) {
      setManualEditedOutputText(recipeManualEditText);
    }
  };

  const ingredientsChangedFn = (newIngredientsText) => {
    setIngredientListText(newIngredientsText);
    recipeChangedFn(recipeTitle,
        newIngredientsText,
        recipeText,
        /* recipeManualEditText= */ null,
        /* brandNew = */ false);
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
    const newRecipe = makeRecipe(recipeTitle, ingredientListText, recipeText, manualEditedOutputText, /* isPublic */ false);
    saveOrUpdateRecipe(newRecipe, firebaseDb, firebaseUser, dispatch);
  };


  return (
    <div className="App">
      <div className="root-container">
        <h1 className="title"> Recipe Converter </h1>
        <RecipeDropDown recipes={globalRecipesList}
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
        <h3 className="section-header"> Converted Recipe:</h3>
        <div className='horz-collection'>
          <button className='btn btn-primary'
            onClick={savePressed} disabled={!saveEnabled}>Save Recipe</button>
        </div>
        <div className='horz-collection'>
          <button className='btn btn-primary'
            disabled={outputType == outputTypeManualEdit}
            onClick={ () => {
              setOutputType(outputTypeManualEdit);
            }}>Manually Edited</button>
          <button className='btn btn-primary'
            disabled={outputType == outputTypeAutomatic}
            onClick={ () => {
              setOutputType(outputTypeAutomatic);
            }}>Auto Generated</button>
          <button className='btn btn-primary'
            disabled={outputType == outputTypeBoth}
            onClick={ () => {
              setOutputType(outputTypeBoth);
            }}>Both</button>
        </div>
        <div className="recipe-output-container">
          <div>
            {(outputType == outputTypeBoth) && <b>Manually Edited</b>}
            <textarea
              className="form-control textarea-autosize"
              onChange={autoConvertedOutputTextChange}
              rows={outputNumRows}
              value={outputType == outputTypeAutomatic ? autoConvertedOutputText : manualEditedOutputText }
            ></textarea>
          </div>
          {(outputType == outputTypeBoth) &&
                <div>
                  <b>Auto-generated</b>
                  <textarea
                    className="form-control textarea-autosize"
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
