import React, { useState, useEffect} from 'react';
import utils from "./../utils/dateFormat";
import browserUtils from "./../utils/browserUtils";
import "./styles.css";

import "react-datepicker/dist/react-datepicker.css";
const initialState = {
  startStandardDate: '',
  endStandardDate: '',
  dateRegion1: '',
  dateRegion2: '',
  saleStatus: 'all',
  stockStatus: 'individual',
  queryState: ''
};

const InputRegion = (props) => {
  const [inputInfo, setInputInfo] = useState(initialState)

  useEffect(() => {
    setInputInfo({...inputInfo, date: utils.dateFormat(new Date()),dateRegion1: utils.dateFormat(new Date()),dateRegion2: utils.dateFormat(new Date()), startStandardDate: utils.dateFormat(new Date()), endStandardDate: utils.dateFormat(new Date())})
  }, [])

  const queryRegion = (region = false) => {
    const {dateRegion1, dateRegion2, saleStatus, stockStatus} = inputInfo;
    let stockInfo = {};
    let startDate = new Date();
    let endDate = new Date();

    if (region) {
      if (region === 'yearAgo') {
        const yearAgo = new Date().getFullYear() - 1
        stockInfo = {
          dateRegion1: utils.dateFormat(new Date(yearAgo, 0, 1)),
          dateRegion2: utils.dateFormat(new Date(yearAgo, 11, 31)),
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
      } else if (region === 'thisYear') {
        const yearAgo = new Date().getFullYear()
        stockInfo = {
          dateRegion1: utils.dateFormat(new Date(yearAgo, 0, 1)),
          dateRegion2: utils.dateFormat(new Date(yearAgo, 11, 31)),
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
      } else {
        startDate.setDate(startDate.getDate() - region);
        endDate.setDate(endDate.getDate() + 1);
        stockInfo = {
          dateRegion1: utils.dateFormat(startDate),
          dateRegion2: utils.dateFormat(endDate),
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
      }
      return props && props.callback(stockInfo);
    } else {
      if (dateRegion1 && dateRegion2 && saleStatus && stockStatus) {
        stockInfo = {
          dateRegion1: dateRegion1,
          dateRegion2: dateRegion2,
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
        props && props.callback(stockInfo);
        setInputInfo({...inputInfo,
          date: '',
          name: '',
          number: '',
          price: '',
          sheet: ''
        })
      } else {
        return alert('不許有任何一個為空');
      }
    }
  };

  const handleStartDateChange = (date) => setInputInfo({...inputInfo, startStandardDate:date, dateRegion1: date, queryState: ''});

  const handleEndDateChange = (date) => setInputInfo({...inputInfo, endStandardDate:date, dateRegion2: date, queryState: ''});

  const getSaleOptions = (e) => setInputInfo({...inputInfo, saleStatus: e.target.value});

  const getStockOptions = (e) => setInputInfo({...inputInfo, stockStatus: e.target.value});

  const getStyleOfButton = () =>{
    if(browserUtils.isMobile()) {
      return {
        margin: '0px 0px',
        paddingRight: '0px',
        paddingLeft: '0px',
        whiteSpace: 'nowrap'
      }
    }else{
      return {
        margin: '3px 0px',
        paddingRight: '0px',
        paddingLeft: '0px',
        whiteSpace: 'nowrap'
      }
    }
  };

  const {startStandardDate, endStandardDate} = inputInfo;
  const isMobile = browserUtils.isMobile();
  return (
    <div>
        <div className="form-row" style={{margin:'5px', overflowY: isMobile ? 'scroll' : 'unset', whiteSpace: 'nowrap'}}>
          <button type="button" className={"btn btn-info from-group col-md-1" + (isMobile ? ' show-all-stock-mobile' : ' show-all-stock')}  onClick={props.resetCallBack}>顯示全部 Stock </button>
          <button type="button"  className={"btn btn-group btn-group-toggle" + (isMobile ? ' from-group col-md-6' : ' from-group' +
            ' col-md-2')} data-toggle="buttons" style={{margin: '0px 10px', zIndex: 0, ...getStyleOfButton()}}>
            <label className="btn btn-secondary active" onClick={getSaleOptions}>
              <input type="radio" name="saleOption" id="saleOption1" value='all' autoComplete="off" /> 全部
            </label>
            <label className="btn btn-secondary" onClick={getSaleOptions}>
              <input type="radio" name="saleOption" id="saleOption2" value='sale' autoComplete="off" /> 已賣出
            </label>
            <label className="btn btn-secondary" onClick={getSaleOptions}>
              <input type="radio" name="saleOption" id="saleOption3" value='unsale'  autoComplete="off" /> 未賣出
            </label>
          </button>
          <div className={"btn-group col-sm-12 col-md-3" + (isMobile ? " query-region-group-mobile": " query-region-group")}  role="group" aria-label="Basic outlined example" style={{width : isMobile ? 'inherit' :'unset', height: '40px', whiteSpace: 'nowrap'}}>
            <button type="button" className="btn btn-outline-primary" onClick={()=> setInputInfo({...inputInfo, queryState: 0})} >Today</button>
            <button type="button" className="btn btn-outline-primary"onClick={()=> setInputInfo({...inputInfo, queryState: 7})}>前 7 日</button>
            <button type="button" className="btn btn-outline-primary"onClick={()=> setInputInfo({...inputInfo, queryState: 30})}>前 30 日</button>
            <button type="button" className="btn btn-outline-primary"onClick={()=> setInputInfo({...inputInfo, queryState: 360})}>前三月</button>
            <button type="button" className="btn btn-outline-primary"onClick={()=> setInputInfo({...inputInfo, queryState: 'yearAgo'})}>去年</button>
            <button type="button" className="btn btn-outline-primary"onClick={()=> setInputInfo({...inputInfo, queryState: 'thisYear'})}>今年</button>
          </div>
          <div className="col-sm-6 col-md-2" style={{margin:'5px 0', float: 'left', display: 'flex', alignItems: 'center', width: browserUtils.isMobile() ? '100%' : 'auto'}}>
              <div>起始區間:</div>
              <div className="col">
                <input type="date" className="form-control" placeholder="日期" onChange={(c) => handleStartDateChange(c.target.value)} value={startStandardDate}/>
              </div>
          </div>
          <div  className="col-sm-6 col-md-2" style={{margin:'5px 0', float: 'left', display: 'flex', alignItems: 'center', width: browserUtils.isMobile() ? '100%' : 'auto'}}>
              <div>結束區間:</div>
              <div className="col">
                <input type="date" className="form-control" placeholder="日期" onChange={(c) => handleEndDateChange(c.target.value)} value={endStandardDate}/>
              </div>
          </div>
          {/* <div className="btn-group btn-group-toggle from-group col-md-1" data-toggle="buttons" style={{...getStyleOfButton(), margin: '10px 0px'}}> */}
            {/* <label className="btn btn-warning active" onClick={getStockOptions} >
              <input type="radio" name="stockOption" id="individual" value='individual' autoComplete="off" /> 個別股
            </label> */}
            {/*<label className="btn btn-warning" onClick={this.getStockOptions} >*/}
            {/*  <input type="radio" name="stockOption" id="mutual" value='mutual' autoComplete="off" /> 共同股*/}
            {/*</label>*/}
          {/* </div> */}
          <button className={"btn btn-primary query-region-submit "+ (isMobile ? ' from-group col-md-2' : ' from-group col-md-2' +
            ' query-region-submit') } style={{...getStyleOfButton(), margin: '10px 0px'}} onClick={()=> queryRegion(inputInfo.queryState)}>查詢送出</button>
        </div>
    </div>
  )
}


export default InputRegion