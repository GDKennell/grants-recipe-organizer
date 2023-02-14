/* eslint-disable react/prop-types */
import React, {useState} from 'react';

export default function ScaleInput({onScaleChange}) {
  const [scale, setScale] = useState(1.0);

  function handleInputChange(event) {
    const input = event.target.value;
    const validInput = /^[0-9]*\.?[0-9]*$/.test(input);

    if (validInput) {
      setScale(input);
      onScaleChange(parseFloat(input));
    }
  }

  return (
    <div>
      <label>
        Scale Factor:
        <input type="text" value={scale} onChange={handleInputChange} />
      </label>
    </div>
  );
}
