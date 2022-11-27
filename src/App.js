import "./App.css";
import { useState } from "react";
import { convertRecipe } from "./RecipeConversion/convertRecipe";
function App() {
  const [outputText, setOutputText] = useState("");
  const textAreaChange = (event) => {
    const newValue = convertRecipe(event.target.value);
    setOutputText(newValue);
  };
  return (
    <div className="App">
      <div className="root-container">
        <textarea
          className="recipe-input-field"
          rows={50}
          onChange={textAreaChange}
        ></textarea>
        <div className="output-field">{outputText}</div>
      </div>
    </div>
  );
}

export default App;
