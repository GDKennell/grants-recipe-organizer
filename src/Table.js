/* eslint-disable react/prop-types */
import React from 'react';
import TableRow from './TableRow';

export default function Table({data}) {
  return (
    <table >
      <tbody>
        {data.map((rowData) => <TableRow rowData={rowData} key={rowData.key}/>)}
      </tbody>
    </table>
  );
}
