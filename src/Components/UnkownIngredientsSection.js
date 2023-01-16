/* eslint-disable react/prop-types */
import React from 'react';
import IngredientInputForm from './IngredientInputForm';

export default function UnkownIngredientsSection({unknownIngredients}) {
  if (!unknownIngredients || unknownIngredients.length == 0) {
    return <></>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Ingredient Name</th>
          <th scope="col">g / cup</th>
          <th scope="col">
            <a href="https://www.aqua-calc.com/calculate/food-volume-to-weight" target="_blank" rel="noreferrer">Look Up </a>
          </th>
        </tr>
      </thead>
      <tbody>
        {unknownIngredients.map((unkIng) =>
          <IngredientInputForm key={unkIng} startText={unkIng}/>,
        )}
      </tbody>
    </table>
  );
}
