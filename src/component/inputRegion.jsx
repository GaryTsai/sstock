import React, {Component} from 'react';
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

export default class InputRegion extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setState({date: utils.dateFormat(new Date()),dateRegion1: utils.dateFormat(new Date()),dateRegion2: utils.dateFormat(new Date()), startStandardDate: utils.dateFormat(new Date()), endStandardDate: utils.dateFormat(new Date())})
  }

  queryRegion = (region = false) => {
    const {dateRegion1, dateRegion2, saleStatus, stockStatus} = this.state;
    let stockInfo = {};
    let startDate = new Date();
    let endDate = new Date();

    if (region) {
      if (region === 'yearAgo') {
        const yearAgo = new Date().getFullYear() - 1
        stockInfo = {
          'dateRegion1': utils.dateFormat(new Date(yearAgo, 0, 1)),
          'dateRegion2': utils.dateFormat(new Date(yearAgo, 11, 31)),
          'saleStatus': saleStatus,
          'stockStatus': stockStatus
        };
      } else if (region === 'thisYear') {
        const yearAgo = new Date().getFullYear()
        stockInfo = {
          'dateRegion1': utils.dateFormat(new Date(yearAgo, 0, 1)),
          'dateRegion2': utils.dateFormat(new Date(yearAgo, 11, 31)),
          'saleStatus': saleStatus,
          'stockStatus': stockStatus
        };
      } else {
        startDate.setDate(startDate.getDate() - region);
        endDate.setDate(endDate.getDate() + 1);
        stockInfo = {
          'dateRegion1': utils.dateFormat(startDate),
          'dateRegion2': utils.dateFormat(endDate),
          'saleStatus': saleStatus,
          'stockStatus': stockStatus
        };
      }
      return this.props && this.props.callback(stockInfo);
    } else {
      if (dateRegion1 && dateRegion2 && saleStatus && stockStatus) {
        stockInfo = {
          'dateRegion1': dateRegion1,
          'dateRegion2': dateRegion2,
          'saleStatus': saleStatus,
          'stockStatus': stockStatus
        };
        this.props && this.props.callback(stockInfo);
        this.setState({
          'date': '',
          'name': '',
          'number': '',
          'price': '',
          'sheet': ''
        })
      } else {
        return alert('不許有任何一個為空');
      }
    }
  };

  handleStartDateChange = (date) => this.setState({startStandardDate:date, dateRegion1: date});

  handleEndDateChange = (date) => this.setState({endStandardDate:date, dateRegion2: date});

  getSaleOptions = (e) => this.setState({saleStatus: e.target.value});

  getStockOptions = (e) => this.setState({stockStatus: e.target.value});

  getStyleOfButton = () =>{
    if(browserUtils.isMobile()) {
      return {
        margin: '0px 0px',
        paddingRight: '0px',
        paddingLeft: '0px',
        whiteSpace: 'nowrap'
      }
    }else{
      return {
        margin: '3px 5px',
        paddingRight: '0px',
        paddingLeft: '0px',
        whiteSpace: 'nowrap'
      }
    }
  };

  render() {
    const {startStandardDate, endStandardDate} = this.state;
    const isMobile = browserUtils.isMobile();
    return (
      <div>
          <div className="form-row" style={{margin:'5px', overflowY: isMobile ? 'scroll' : 'unset'}}>
            <button type="button" className={"btn btn-info from-group col-md-2" + (isMobile ? ' show-all-stock-mobile' : ' show-all-stock')}  onClick={this.props.resetCallBack}>顯示全部 Stock </button>
            <button type="button"  className={"btn btn-group btn-group-toggle" + (isMobile ? ' from-group col-md-6' : ' from-group' +
              ' col-md-2')} data-toggle="buttons" style={{margin: '0px 10px', zIndex: 0, ...this.getStyleOfButton()}}>
              <label className="btn btn-secondary active" onClick={this.getSaleOptions}>
                <input type="radio" name="saleOption" id="saleOption1" value='all' autoComplete="off" /> 全部
              </label>
              <label className="btn btn-secondary" onClick={this.getSaleOptions}>
                <input type="radio" name="saleOption" id="saleOption2" value='sale' autoComplete="off" /> 已賣出
              </label>
              <label className="btn btn-secondary" onClick={this.getSaleOptions}>
                <input type="radio" name="saleOption" id="saleOption3" value='unsale'  autoComplete="off" /> 未賣出
              </label>
            </button>
            <div className={"btn-group" + (isMobile ? " query-region-group-mobile": " query-region-group")}  role="group" aria-label="Basic outlined example" style={{width : isMobile ? 'inherit' :'unset'}}>
              <button type="button" className="btn btn-outline-primary" onClick={()=>this.queryRegion(0)} >Today</button>
              <button type="button" className="btn btn-outline-primary"onClick={()=>this.queryRegion(7)}>前 7 日</button>
              <button type="button" className="btn btn-outline-primary"onClick={()=>this.queryRegion(30)}>前 30 日</button>
              <button type="button" className="btn btn-outline-primary"onClick={()=>this.queryRegion(120)}>前三月</button>
              <button type="button" className="btn btn-outline-primary"onClick={()=>this.queryRegion('yearAgo')}>去年</button>
              <button type="button" className="btn btn-outline-primary"onClick={()=>this.queryRegion('thisYear')}>今年</button>
            </div>
            <div style={{margin:'5px', float: 'left', display: 'flex', alignItems: 'center', width: browserUtils.isMobile() ? '100%' : 'auto'}}>
                <div>起始區間:</div>
                <div className="col">
                  <input type="date" className="form-control" placeholder="日期" onChange={(c) => this.handleStartDateChange(c.target.value)} value={startStandardDate}/>
                </div>
            </div>
            <div style={{margin:'5px', float: 'left', display: 'flex', alignItems: 'center', width: browserUtils.isMobile() ? '100%' : 'auto'}}>
                <div>結束區間:</div>
                <div className="col">
                  <input type="date" className="form-control" placeholder="日期" onChange={(c) => this.handleEndDateChange(c.target.value)} value={endStandardDate}/>
                </div>
              </div>
            <div className="btn-group btn-group-toggle from-group col-md-3" data-toggle="buttons" style={{margin: '0px 10px', zIndex: 0, ...this.getStyleOfButton()}}>
              <label className="btn btn-warning active" onClick={this.getStockOptions} >
                <input type="radio" name="stockOption" id="individual" value='individual' autoComplete="off" /> 個別股
              </label>
              {/*<label className="btn btn-warning" onClick={this.getStockOptions} >*/}
              {/*  <input type="radio" name="stockOption" id="mutual" value='mutual' autoComplete="off" /> 共同股*/}
              {/*</label>*/}
            </div>
            <button className={"btn btn-primary query-region-submit "+ (isMobile ? ' from-group col-md-3' : ' from-group col-md-1' +
              ' query-region-submit') } onClick={()=>this.queryRegion('')}>查詢送出</button>
          </div>
      </div>
    )
  }
}
