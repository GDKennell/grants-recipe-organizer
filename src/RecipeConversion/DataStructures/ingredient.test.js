import {parseShortIngredient} from './ingredient';
import {expect, test} from '@jest/globals';


test('2 + 2 = 4', () => {
  expect(2 + 2).toEqual(4);
});

// test('parses short ingredients; mayonnaise', () => {
//   const testString = 'mayonnaise 220.0';
//   const result = parseShortIngredient(testString);
//   expect(result.names).toEqual(['mayonnaise', 'mayonnaises']);
//   expect(result.gramsPerCup).toEqual(220.0);
// });

// test('parses short ingredients; sour cream', () => {
//   const testString = 'sour cream 230.0';
//   const result = parseShortIngredient(testString);
//   expect(result.names).toEqual(['sour cream', 'sour creams']);
//   expect(result.gramsPerCup).toEqual(230.0);
// });
