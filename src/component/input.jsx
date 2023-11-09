import React, { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import utils from "./../utils/dateFormat";
import api from './../api/api'
import "react-datepicker/dist/react-datepicker.css";
import browserUtils from "./../utils/browserUtils";
import { changeContentLoading } from '../slices/mutualState';
import { fetchStock } from '../slices/apiDataSlice';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";

const initialState = {
  date: new Date(),
  name: '',
  number: '',
  code_name:'',
  price: '',
  sheet: '',
  isSaleOpen: true,
  datePickerDate: new Date()
};

const Input = () => {
  const [inputInfo, setInputInfo] = useState(initialState)
  const dispatch = useDispatch()
  const location = useLocation()
  const { acMoney } = useSelector((state) => state.apiDataReducer);
  const { t } = useTranslation();

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
    const buyExpense = parseFloat(price) * parseFloat(sheet) * 1000

    if(buyExpense > acMoney){
      Swal.fire({
        icon: 'error',
        title: t("alertError"),
        text: t("depositIsNotEnough")
      })
    } else if (date && name && number && !isNaN(price) && !isNaN(sheet)) {
      const stockInfo = {date: date, name: name, number: number, price: parseFloat(price), sheet: parseFloat(sheet)};
      
      api.insertNewData(stockInfo).then(() => {
        api.updateAccountRecord(stockInfo, false);
        dispatch(fetchStock())
      });
      setInputInfo({
        ...inputInfo,
        name: '',
        number: '',
        price: '',
        sheet: ''
      })
    } else {
      return Swal.fire({
        icon: 'warning',
        title: t("alertWarning"),
        text: t("buyFieldsIsEmpty")
      })
    }
  };

  const handleChange = (date) => {
    setInputInfo({...inputInfo, date: date, datePickerDate: date})
  };

  const saleIsOpen = () => setInputInfo({...inputInfo, isSaleOpen: !inputInfo.isSaleOpen});
  
  const {datePickerDate, name, number, price, sheet, isSaleOpen} = inputInfo;
  const isMobile = browserUtils.isMobile();
  const isStockHistory = location.pathname === '/sstock/stockHistory'

  return (
    <>
    {!isStockHistory && <div style={{margin: isMobile ?  '0px 5px 0px 5px' : '0 5px'}}> 
      {isSaleOpen && <div className="form-row">
        <div className="col-md-2 stock-input-fields" >
          <input type="date" className="form-control" placeholder={t('input.date')}
                  onChange={(c) => handleChange(c.target.value)} value={datePickerDate}/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder={t('input.stockName')}
                  onChange={(c) => inputName(c.target.value)} value={name} autoComplete="on"/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder={t('input.stockNumber')}
                  onChange={(c) => inputNumber(c.target.value)} value={number} autoComplete="on"/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder={t('input.stockPrice')}
                  onChange={(c) => inputPrice(c.target.value)} value={price} autoComplete="on"/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder={t('input.stockSheet')}
                  onChange={(c) => inputSheet(c.target.value)} value={sheet} autoComplete="on"/>
        </div>
        <button className="btn btn-primary from-group col-sm-12 col-md-2 input-sale-frame" type="submit" style={{borderRadius: '5px', margin: '3px 0px'}}
                onClick={() => submitStock()}>{t('input.buyConfirm')}
        </button>
      </div>}
    </div>}
    {isMobile && !isSaleOpen && !isStockHistory && <button className="btn btn-warning from-group col-sm-2 col-md-12 input-sale-frame" type="submit"
              onClick={() => saleIsOpen()}>{t('input.buy')}</button>}
    {isMobile && isSaleOpen && !isStockHistory &&
    <button className="btn btn-secondary from-group col-sm-2 col-md-12 input-sale-frame" type="submit"
              onClick={() => saleIsOpen(false)}>{t('hide')}</button>}  
    </>
  )
}

export default Input