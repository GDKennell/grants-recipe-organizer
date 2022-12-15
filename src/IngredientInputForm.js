import React, {useState} from 'react';

export default function IngredientInputForm() {
  const [ingredientText, setIngredientText] = useState('');
  const [gramsPerCupText, setGramsPerCupText] = useState('');
  const handleIngredientChange = (event) => {
    setIngredientText(event.target.value);
  };
  const handleGramsPerCupChange = (event) => {
    setGramsPerCupText(event.target.value);
  };

  const handleSubmit = () => {
    console.log(`Submitting ${ingredientText} ${gramsPerCupText}`);
  };
  return (
    <div>
            Add new ingredient
      <br/>
      <label>          Ingredient:
        <input type="text" onChange={handleIngredientChange} />
      </label>
      <label>          Grams per Cup:
        <input type="text" onChange={handleGramsPerCupChange} />
      </label>
      <button onClick={handleSubmit}> Submit </button>
    </div>
  );
}

