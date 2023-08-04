import React, { useState, useEffect} from 'react';
import utils from "./../utils/dateFormat";
import api from './../api/api'
import "react-datepicker/dist/react-datepicker.css";
import browserUtils from "./../utils/browserUtils";

const initialState = {
  date: new Date(),
  name: '',
  number: '',
  code_name:'',
  price: '',
  sheet: '',
  datePickerDate: new Date()
};

const Input = (props) => {

  const [inputInfo, setInputInfo] = useState(initialState)

  useEffect(() => {
    setInputInfo({...inputInfo, date: utils.dateFormat(new Date()), datePickerDate: utils.dateFormat(new Date())})
  }, [])

  const inputName = name => {
    setInputInfo({
      ...inputInfo, name: name
    })
  };

  const inputNumber = number => {
    setInputInfo({
      ...inputInfo, number: number
    })
  };

  const inputPrice = price => {
    setInputInfo({
      ...inputInfo, price: price
    })
  };

  const inputSheet = sheet => {
    setInputInfo({
      ...inputInfo, sheet: sheet
    })
  };

  const submitStock = () => {
    const {date, name, number, price, sheet} = inputInfo;
    if (date && name && number && !isNaN(price) && !isNaN(sheet)) {
      const stockInfo = {date: date, name: name, number: number, price: parseFloat(price), sheet: parseFloat(sheet)};
      api.updateAccountRecord(stockInfo, false);
      props && props.callback(stockInfo);
      setInputInfo({
        ...inputInfo,
        name: '',
        number: '',
        price: '',
        sheet: ''
      })
    } else {
      return alert('不許有任何一個為空');
    }
  };

  const handleChange = (date) => {
    setInputInfo({...inputInfo, date: date, datePickerDate: date})
  };


  const {datePickerDate, name, number, price, sheet} = inputInfo;
  const isMobile = browserUtils.isMobile();

  return (
    <div style={{margin: isMobile ?  '5px 5px 0px 5px' : '5px'}}>
      <div className="form-row">
        <div className="col-md-2 stock-input-fields" >
          <input type="date" className="form-control" placeholder="日期"
                  onChange={(c) => handleChange(c.target.value)} value={datePickerDate}/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder="股票名稱"
                  onChange={(c) => inputName(c.target.value)} value={name} autoComplete="on"/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder={"編號" }
                  onChange={(c) => inputNumber(c.target.value)} value={number} autoComplete="on"/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder="單價"
                  onChange={(c) => inputPrice(c.target.value)} value={price} autoComplete="on"/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder={"張數" }
                  onChange={(c) => inputSheet(c.target.value)} value={sheet} autoComplete="on"/>
        </div>
        <button className="btn btn-primary from-group col-sm-12 col-md-2 input-sale-frame" type="submit"
                onClick={() => submitStock()}>確認買入
        </button>
      </div>
    </div>
  )
}

export default Input