import React, {Component} from 'react';

const initialState = {
};

export default class Record extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
  }

  render() {
    const {record, index} = this.props;
    return (
      <tr>
        <th scope="row">{index}</th>
        <td>{record.account_record_Money}</td>
        <td>{record.account_record_Stock}</td>
        <td>{record.transfer}</td>
        <td>{record.transferStatus=== '轉出' ? '轉出' : '存入'}</td>
        <td>{record.transferTime}</td>
        <td>{record.source}</td>
      </tr>
    )
  }
}
