import React from 'react';
import { styled } from "@mui/material";

const sourceMapping = {
  '股利': 1,
  '薪資': 2,
'手續費折': 3
}

const sourceStyle = ({source}, htmlTag) => {
  let colorNumber = null 
  if(!source) {
    return 
  }
  Object.keys(sourceMapping).forEach(element => {
    if(!!colorNumber) return
    colorNumber = source.search(element) !== -1 && sourceMapping[element]
  });
  if(htmlTag === 'tr')
    switch (colorNumber) {
      case 1:
        return { borderBottom: '5px solid #ffc6c1'}
      case 2:
        return { borderBottom: '5px solid #7ae0d7' }
      case 3:
        return { borderBottom: '5px solid #edb8ed' }
      default:
        return { background: 'white' }
    }
  if(htmlTag === 'td')
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
  sourceStyle(source, 'td')
));

const Tr = styled('tr')((source) => (
   sourceStyle(source, 'tr')
));

const Record = (props) => {
  const {record, index} = props;
  return (
    <Tr source={record.source}>
      <th scope="row">{index}</th>
      <td>{record.account_record_Money}</td>
      <td>{record.account_record_Stock}</td>
      <Td source={record.source}>{record.transfer}</Td>
      <td>{record.transferStatus}</td>
      <td>{record.transferTime}</td>
      <Td source={record.source}>{record.source}</Td>
    </Tr>
  )
}

export default Record