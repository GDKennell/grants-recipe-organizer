import {expect, test} from '@jest/globals';
import {convertDecimalsToFractions} from './numberConversion';


test('0.5 cups', () => {
  const decimalString = '(0.5 cups)';
  const expectedString = '(1/2 cups)';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('and 1.25 tbsp', () => {
  const decimalString = 'and 1.25 tbsp';
  const expectedString = 'and 1 1/4 tbsp';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('1.324 lbs', () => {
  const decimalString = '1.324 lbs';
  const expectedString = '1.324 lbs';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});

test('1/8 grams', () => {
  const decimalString = '0.125 grams';
  const expectedString = '1/8 grams';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});

test('2/3 cups', () => {
  const decimalString = '0.66 cups';
  const expectedString = '2/3 cups';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});

test('0.6 cups', () => {
  const decimalString = '0.6 cups';
  const expectedString = '0.6 cups';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('1/2 cup', () => {
  const decimalString = '0.50 cup';
  const expectedString = '1/2 cup';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('3 1/4 cups', () => {
  const decimalString = '3.25 cups';
  const expectedString = '3 1/4 cups';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('2 1/3 tsp', () => {
  const decimalString = '2.33 tsp';
  const expectedString = '2 1/3 tsp';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('1/3 cup', () => {
  const decimalString = '0.33 cup';
  const expectedString = '1/3 cup';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('3/16', () => {
  const decimalString = '0.19 cup';
  const expectedString = '3/16 cup';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});

test('1/16 cup', () => {
  const decimalString = '0.06 cup';
  const expectedString = '1/16 cup';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});

test('1/8 cup', () => {
  const decimalString = '0.13 cup';
  const expectedString = '1/8 cup';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});

test('0.32 cups', () => {
  const decimalString = '0.32 cups';
  const expectedString = '0.32 cups';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


test('0.34 cups', () => {
  const decimalString = '0.34 cups';
  const expectedString = '0.34 cups';

  expect(convertDecimalsToFractions(decimalString)).toEqual(expectedString);
});


