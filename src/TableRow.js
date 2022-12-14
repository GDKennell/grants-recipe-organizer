/* eslint-disable react/prop-types */
import React from 'react';

export default function TableRow({rowData, key}) {
  return (
    <tr key={key} >
      <td style= {{border: '1px solid'}}>{rowData.names.join(', ')}</td>
      <td style= {{border: '1px solid'}}> {rowData.gramsPerCup} </td>
    </tr>

  );
}


