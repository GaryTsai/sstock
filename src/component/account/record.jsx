import React from 'react';
import { styled } from "@mui/material";

const sourceMapping = {
  '股利': 1,
  '薪資': 2,
'手續費折': 3
}

const sourceStyle = ({source}) => {
  let colorNumber = null 
  if(!source) {
    return 
  }
  Object.keys(sourceMapping).forEach(element => {
    if(!!colorNumber) return
    colorNumber = source.search(element) !== -1 && sourceMapping[element]
  });

  switch (colorNumber) {
    case 1:
      return { color: 'red'}
    case 2:
      return { color: 'green' }
    case 3:
      return { color: 'purple' }
    default:
      return { color: 'black' }
  }
}

const Td = styled('td')((source) => (
   sourceStyle(source)
));

const Record = (props) => {
  const {record, index} = props;
  return (
    <tr>
      <th scope="row">{index}</th>
      <td>{record.account_record_Money}</td>
      <td>{record.account_record_Stock}</td>
      <Td source={record.source}>{record.transfer}</Td>
      <td>{record.transferStatus}</td>
      <td>{record.transferTime}</td>
      <Td source={record.source}>{record.source}</Td>
    </tr>
  )
}

export default Record