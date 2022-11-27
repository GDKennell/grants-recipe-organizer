import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [outputText, setOutputText] = useState("");
  const textAreaChange = (event) => {
    const newValue = event.target.value.replaceAll("\n", "\n");
    setOutputText(newValue);
    console.log(event.target.value);
  };
  return (
    <div className="App">
      <div className="root-container">
        <textarea
          className="recipe-input-field"
          rows="50"
          onChange={textAreaChange}
        ></textarea>
        <div className="output-field">{outputText}</div>
      </div>
    </div>
  );
}

export default App;
