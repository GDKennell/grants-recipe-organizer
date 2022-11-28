import "./App.css";
import { useState } from "react";
import { convertRecipe } from "./RecipeConversion/convertRecipe";
function App() {
  const initialText =
    "\nPie 101 page \n\npie crust 101 – smitten kitchen\n\n- 2.5 cups flour\n- 1 tsp salt\n- Two Tbsp sugar \n- 2 cups butter \n- 1/4 cup water\n- 1/4 cup vodka \n\n";
  const [outputText, setOutputText] = useState(convertRecipe(initialText));
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
          value={initialText}
        ></textarea>
        <div className="output-field">{outputText}</div>
      </div>
    </div>
  );
}

export default App;
