import React, {Component} from 'react';
import { styled } from "@mui/material";
const sourceMapping = {
  '股利': 1,
  '薪資': 2,
'手續費折': 3
}

const sourceColor = ({source}) => {
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
      return 'red'
      break;
    case 2:
      return 'green'
      break;  
    case 3:
      return 'purple'
      break;  
    default:
      return 'black'
      break;
  }
}

const Td = styled('td')((source) => ({
  color: sourceColor(source),
}));

const initialState = {
};

export default class Record extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    const {record, index} = this.props;
    return (
      <tr>
        <th scope="row">{index}</th>
        <td>{parseFloat(record.account_record_Money).toFixed(0)}</td>
        <td>{parseFloat(record.account_record_Stock).toFixed(0)}</td>
        <td>{record.transfer}</td>
        <td>{record.transferStatus=== '轉出' ? '轉出' : '存入'}</td>
        <td>{record.transferTime}</td>
        <Td source={record.source}>{record.source}</Td>
      </tr>
    )
  }
}
