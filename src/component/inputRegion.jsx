import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import utils from "./../utils/dateFormat";
import browserUtils from "./../utils/browserUtils";
import "./styles.css";

import "react-datepicker/dist/react-datepicker.css";
const initialState = {
  'startStandardDate': '',
  'endStandardDate': '',
  'dateRegion1': '',
  'dateRegion2': '',
  'saleStatus': 'all',
  'stockStatus': 'individual'

};

export default class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setState({date: this.getFormatDate(new Date()), startStandardDate:this.getFormatDate(new Date()), endStandardDate:this.getFormatDate(new Date())})
  }
  getFormatDate = date => {

    const year = date.getFullYear();
    const month = utils.toDualDigit(date.getMonth() + 1);
    const day = utils.toDualDigit(date.getDate());

    return year + '-' + month + '-' + day
  };
  queryRegion = () =>{
    const {dateRegion1, dateRegion2, saleStatus, stockStatus} = this.state;

    if(dateRegion1 && dateRegion2 && saleStatus && stockStatus){
      const stockInfo ={'dateRegion1':this.getFormatDate(dateRegion1), 'dateRegion2':this.getFormatDate(dateRegion2), 'saleStatus':saleStatus, 'stockStatus':stockStatus};
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

  handleStartDateChange = (date) => this.setState({startStandardDate:date, dateRegion1: date});

  handleEndDateChange = (date) => this.setState({endStandardDate:date, dateRegion2: date});

  getSaleOptions = (e) => this.setState({saleStatus: e.target.value});

  getStockOptions = (e) => this.setState({stockStatus: e.target.value});

  getMobileStyleOfButton = () =>{
    return {
      margin: '3px 0px'
    }
  };

  render() {
    const {startStandardDate, endStandardDate} = this.state;
    const isMobile = browserUtils.isMobile();
    return (
      <div>
          <div className="form-row" style={{margin:'5px', overflowY: isMobile ? 'scroll' : 'unset'}}>
            <button type="button" className="btn btn-info from-group col-md-2" style={{margin: '3px 5px'}}  onClick={this.props.resetCallBack}>顯示全部 Stock </button>
            {
              <div style={{margin:'5px', float: 'left', display: 'flex', alignItems: 'center'}}>
                <div>起始區間:</div>
                <div className="col">
                  <input type="date" className="form-control" placeholder="日期" onChange={(c) => this.handleStartDateChange(c.target.value)} value={startStandardDate}/>
                </div>
            </div>}
            {
            <div style={{margin:'5px', float: 'left', display: 'flex', alignItems: 'center'}}>
                <div>結束區間:</div>
                <div className="col">
                  <input type="date" className="form-control" placeholder="日期" onChange={(c) => this.handleEndDateChange(c.target.value)} value={endStandardDate}/>
                </div>
              </div>
            }
            <div className={"btn-group btn-group-toggle" + (isMobile ? ' from-group col-md-6' : ' from-group col-md-2')} data-toggle="buttons" style={{margin: '0px 10px', zIndex: 0, ...this.getMobileStyleOfButton()}}>
              <label className="btn btn-secondary active" onClick={this.getSaleOptions}>
                <input type="radio" name="saleOption" id="saleOption1" value='all' autoComplete="off" /> 全部
              </label>
              <label className="btn btn-secondary" onClick={this.getSaleOptions}>
                <input type="radio" name="saleOption" id="saleOption2" value='sale' autoComplete="off" /> 已賣出
              </label>
              <label className="btn btn-secondary" onClick={this.getSaleOptions}>
                <input type="radio" name="saleOption" id="saleOption3" value='unsale'  autoComplete="off" /> 未賣出
              </label>
            </div>
            <div className="btn-group btn-group-toggle from-group col-md-2" data-toggle="buttons" style={{margin: '0px 10px', zIndex: 0, ...this.getMobileStyleOfButton()}}>
              <label className="btn btn-warning active" onClick={this.getStockOptions} >
                <input type="radio" name="stockOption" id="individual" value='individual' autoComplete="off" /> 個別股
              </label>
              {/*<label className="btn btn-warning" onClick={this.getStockOptions} >*/}
              {/*  <input type="radio" name="stockOption" id="mutual" value='mutual' autoComplete="off" /> 共同股*/}
              {/*</label>*/}
            </div>
            <button className={"btn btn-primary "+ (isMobile ? ' from-group col-md-2' : ' from-group col-md-1') }type="submit" style={{margin: '3px 5px'}} onClick={this.queryRegion}>查詢送出</button>
          </div>
      </div>
    )
  }
}
