import { useEffect, useState } from "react";
import "./App.css";
import { convertRecipe } from "./RecipeConversion/convertRecipe";
function App() {
  const [outputText, setOutputText] = useState("");

  const minRows = 5;
  const [ingredientListText, setIngredientListText] = useState("");
  const [recipeText, setRecipeText] = useState("");

  const [ingredientListNumRows, setIngredientListNumRows] = useState(minRows);
  const ingredientTextAreaChange = (event) => {
    const textInput = event.target.value;
    setIngredientListText(textInput);
    const numLines = textInput.split("\n").length;
    setIngredientListNumRows(Math.max(minRows, numLines));
  };

  const [recipeNumRows, setRecipeNumRows] = useState(minRows);
  const recipeTextAreaChange = (event) => {
    const textInput = event.target.value;
    setRecipeText(textInput);
    const numLines = textInput.split("\n").length;
    setRecipeNumRows(Math.max(minRows, numLines));
  };

  useEffect(() => {
    const newValue = convertRecipe(ingredientListText, recipeText);
    setOutputText(newValue);
  }, [ingredientListText, recipeText]);

  return (
    <div className="App">
      <div className="root-container">
        <h1 className="title"> Recipe Converter </h1>
        <h3 className="instructions"> Paste recipe below:</h3>
        <div className="instructions">Ingredient list</div>
        <textarea
          className="ingredient-list input-field"
          rows={ingredientListNumRows}
          onChange={ingredientTextAreaChange}
        ></textarea>
        <div className="instructions">Preparation Steps</div>

        <textarea
          className="main-recipe input-field"
          onChange={recipeTextAreaChange}
        ></textarea>
        <div className="output-field">{outputText}</div>
      </div>
    </div>
  );
}

export default App;
