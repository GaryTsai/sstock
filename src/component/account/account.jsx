import React, {Component} from 'react';
import Record from './record'
import AccountTransfer from './AccountTransfer'
import api from '../../api/api'

const initialState = {
  acTime: '',
  acMoney: '',
  acStock: '',
  acSummary: '',
  records:[],
};

export default class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.updateAccount();
  }

  updateAccount = () =>{
    api.getAccount().then((data)=> {
        this.setState({
          acTime: data.accountTime,
          acMoney: data.accountMoney,
          acStock: data.accountStock,
          acSummary: data.summary,
        });
      });
    api.getAccountRecord().then((data)=>{
      this.setState({records:data})
    });
  };

  render() {
    const {acTime, acMoney, acStock, acSummary, records} = this.state;

    return (
      <div style={{ margin:'auto 10%' }}>
        <AccountTransfer callback={this.updateAccount}/>
      <div className="container">
        <table className="table table-striped">
          <thead>
          <tr>
            <th>創建時間</th>
            <th>帳戶金額</th>
            <th>股票帳戶</th>
            <th>總金額</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{acTime}</td>
            <td>{acMoney}</td>
            <td>{acStock}</td>
            <td>{acSummary}</td>
          </tr>
          </tbody>
        </table>
      </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">帳戶金額</th>
              <th scope="col">股票金額</th>
              <th scope="col">轉出金額</th>
              <th scope="col">轉出時間</th>
              <th scope="col">轉入金額</th>
              <th scope="col">轉入時間</th>
              <th scope="col">來源</th>
            </tr>
            </thead>
            <tbody>
            {
              records&&records.map((record, index) => (
                <Record ket={index} record={record} index={index}/>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
