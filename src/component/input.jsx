import React, {Component} from 'react';
import utils from "./../utils/dateFormat";
import api from './../api/api'
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
  'date': new Date(),
  'name': '',
  'number': '',
  'price': '',
  'sheet': '',
  'datePickerDate': new Date()
};

export default class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setState({date: utils.dateFormat(new Date()), datePickerDate: utils.dateFormat(new Date())})
  }

  inputDate = date => {
    this.setState({
      date
    })
  };

  inputName = name => {
    this.setState({
      name
    })
  };

  inputNumber = number => {
    this.setState({
      number
    })
  };

  inputPrice = price => {
    this.setState({
      price
    })
  };

  inputSheet = sheet => {
    this.setState({
      sheet
    })
  };

  submitStock = () => {
    const {date, name, number, price, sheet} = this.state;

    if (date && name && number && !isNaN(price) && !isNaN(sheet)) {
      const stockInfo = {'date': date, 'name': name, 'number': number, 'price': price, 'sheet': sheet};
      api.updateAccountRecord(stockInfo, true);
      this.props && this.props.callback(stockInfo);
      this.setState({
        'name': '',
        'number': '',
        'price': '',
        'sheet': ''
      })
    } else {
      return alert('不許有任何一個為空');
    }
  };

  handleChange = (date) => {
    this.setState({date: date, datePickerDate: date})
  };

  render() {
    const {datePickerDate} = this.state;
    return (
      <div style={{margin: '5px 5px'}}>
        <div className="form-row">
          <div className="col">
            <input type="date" className="form-control" placeholder="日期"
                   onChange={(c) => this.handleChange(c.target.value)} value={datePickerDate}/>
          </div>
          <div className="from-group col-md-2 input-sale-frame">
            <input type="text" className="form-control" placeholder="股票名稱"
                   onChange={(c) => this.inputName(c.target.value)} value={this.state.name}/>
          </div>
          <div className="from-group col-md-2 input-sale-frame">
            <input type="text" className="form-control" placeholder="編號"
                   onChange={(c) => this.inputNumber(c.target.value)} value={this.state.number}/>
          </div>
          <div className="from-group col-md-2 input-sale-frame">
            <input type="text" className="form-control" placeholder="單價"
                   onChange={(c) => this.inputPrice(c.target.value)} value={this.state.price}/>
          </div>
          <div className="from-group col-md-2 input-sale-frame">
            <input type="text" className="form-control" placeholder="張數"
                   onChange={(c) => this.inputSheet(c.target.value)} value={this.state.sheet}/>
          </div>
          <button className="btn btn-primary from-group col-md-2 input-sale-frame" type="submit"
                  onClick={this.submitStock}>確認送出
          </button>
        </div>
      </div>
    )
  }
}
