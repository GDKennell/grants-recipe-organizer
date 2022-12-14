/* eslint-disable react/prop-types */
import React from 'react';

export default function TableRow({rowData, key}) {
  return (
    <tr key={key}>
      <td>{rowData.names.join(', ')}</td>
      <td> {rowData.gramsPerCup} </td>
    </tr>

  );
}


