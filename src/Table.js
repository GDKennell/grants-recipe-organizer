/* eslint-disable react/prop-types */
import React from 'react';
import TableRow from './TableRow';

export default function Table({data}) {
  const headerData = {names: ['Ingredient Name(s)'], gramsPerCup: 'Grams per Cup'};
  return (
    <table style= {{border: '1px solid'}}>
      <tbody>
        <TableRow rowData={headerData} key = {'heyimakeygoshdarnit'} />
        {data.map((rowData) => <TableRow rowData={rowData} key={rowData.key}/>)}
      </tbody>
    </table>
  );
}
