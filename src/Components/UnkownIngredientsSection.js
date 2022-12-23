/* eslint-disable react/prop-types */
import React from 'react';
import IngredientInputForm from './IngredientInputForm';

export default function UnkownIngredientsSection({unknownIngredients}) {
  return (
    <div>
      {unknownIngredients.map((string) => <IngredientInputForm key={string} startText={string}/>)}
    </div>
  );
}
