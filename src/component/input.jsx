import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import utils from "./../utils/dateFormat";

import "react-datepicker/dist/react-datepicker.css";
const initialState = {
  'date':new Date(),
  'name':'',
  'number': '',
  'price': '',
  'sheet':'',
  'datePickerDate':new Date()
};

export default class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setState({date: this.getFormatDate(new Date())})
  }

  inputDate = date =>{
    this.setState({
      date
    })
  };

  inputName = name =>{
    this.setState({
      name
    })
  };

  inputNumber = number =>{
    this.setState({
      number
    })
  };

  inputPrice = price =>{
    this.setState({
      price
    })
  };

  inputSheet = sheet =>{
    this.setState({
      sheet
    })
  };

  submitStock = () =>{
    const {date, name, number, price ,sheet} = this.state;
    if(date && name && number && !isNaN(price) && !isNaN(sheet)){
      const stockInfo ={'date':date, 'name':name, 'number':number, 'price':price ,'sheet':sheet};
      this.props && this.props.callback(stockInfo);
      this.setState({  'date':'',
        'name':'',
        'number': '',
        'price': '',
        'sheet':''
      })
    }
    else{
      return alert('不許有任何一個為空');
    }
  };

  getFormatDate = date => {
    const year = date.getFullYear();
    const month = utils.toDualDigit(date.getMonth() + 1);
    const day = utils.toDualDigit(date.getDate());

    return year + '-' + month + '-' + day
  };

  handleChange = (date) =>{
    this.setState({date: this.getFormatDate(date), datePickerDate:date})
  };


  render() {
    const {datePickerDate} = this.state;
    return (
      <div style={{margin:'0px 5px'}}>
          <div className="form-row">
            {/*<div className="col">*/}
            {/*  <input type="text" className="form-control" placeholder="日期" onChange={(c) => this.inputDate(c.target.value)} value={this.state.date}/>*/}
            {/*</div>*/}
            <div className="from-group col-md-2 input-sale-frame" >
            <DatePicker
              selected={datePickerDate}
              onChange={this.handleChange}
              // onFocus={e=>{e.preventDefault();e.stopPropagation();}
              onFocus={e => e.preventDefault()}
              // readOnly={true}
            />
            </div>
            <div className="from-group col-md-2 input-sale-frame">
              <input type="text" className="form-control" placeholder="股票名稱" onChange={(c) => this.inputName(c.target.value)} value={this.state.name}/>
            </div>
            <div className="from-group col-md-2 input-sale-frame" >
            <input type="text" className="form-control" placeholder="編號" onChange={(c) => this.inputNumber(c.target.value)} value={this.state.number}/>
            </div>
            <div className="from-group col-md-2 input-sale-frame">
              <input type="text" className="form-control" placeholder="單價" onChange={(c) => this.inputPrice(c.target.value)} value={this.state.price}/>
            </div>
            <div className="from-group col-md-2 input-sale-frame">
              <input type="text" className="form-control" placeholder="張數" onChange={(c) => this.inputSheet(c.target.value)} value={this.state.sheet}/>
            </div>
            <button className="btn btn-primary from-group col-md-2 input-sale-frame" type="submit"  onClick={this.submitStock}>確認送出</button>
          </div>
      </div>
    )
  }
}
