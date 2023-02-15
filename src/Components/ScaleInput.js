/* eslint-disable react/prop-types */
import React, {useState} from 'react';

export default function ScaleInput({onScaleChange}) {
  const [scale, setScale] = useState(1.0);

  function handleInputChange(event) {
    const input = event.target.value;
    const value = parseFloat(input);
    const validInput = /^[0-9]*\.?[0-9]*$/.test(input);

    if (validInput) {
      setScale(input);
    }

    if (!isNaN(value)) {
      onScaleChange(value);
    }
  }

  return (
    <div>
      <label>
        Scale Factor:
        <input className='grams-per-cup-input' type="text" value={scale} onChange={handleInputChange} />
      </label>
    </div>
  );
}
