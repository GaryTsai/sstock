import React, {Component} from 'react';

const initialState = {
};

export default class Stock extends Component {
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
        <td>{record.transferOut}</td>
        <td>{record.transferOutTime}</td>
        <td>{record.transferIn}</td>
        <td>{record.transferInTime}</td>
        <td>{record.source}</td>
      </tr>
    )
  }
}
