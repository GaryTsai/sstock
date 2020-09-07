import React, {Component} from 'react';
import Stock from './stock';
import InputRegion from "./inputRegion";
import browserUtils from "./../utils/browserUtils";
const initialState = {
  allData:[],
  allStocks:"",
  isQueryOpen: false
};

export default class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate(nextProps, nextContext) {
    // if(this.props !== nextProps){
    //   // this.updateAllData(nextProps.inputData);
    //   this.updateAllData(nextProps.allStocks);
    // }
  }

  componentDidMount() {
    const allStocks = this.props;
    if(allStocks){
      this.setState({allStocks:allStocks})
    }
  }
  queryData = (stockInfo) => this.props.queryDataCallback(stockInfo);


  delete = (timestamp) =>{
    this.props.deleteCallback(timestamp);
  };

  isQueryOpen = status => this.setState({isQueryOpen:status});

  getQueryStatus = () =>{
    if(!browserUtils.isMobile()){
      return true
    }else{
      return this.state.isQueryOpen;
    }
  };


  render() {
    const {allStocks, route}= this.props;
    const {isQueryOpen}= this.state;
    const isMobile = browserUtils.isMobile();
    return (
      <div>
        {route === 'summary' && !isQueryOpen && isMobile && <button className="btn btn-warning from-group col-md-2" type="submit" onClick={() => this.isQueryOpen(true)}>查詢時區</button>}
        {route === 'summary' && isQueryOpen && isMobile && <button className="btn btn-secondary from-group col-md-2" type="submit" onClick={() => this.isQueryOpen(false)}>隱藏</button>}
        {route === 'summary' && this.getQueryStatus() && <InputRegion callback={this.queryData} resetCallBack={this.props.resetCallBack}/>}
        <div style={{overflowY: browserUtils.isMobile() ? 'scroll' : 'unset'}}>
        <table className="table table-dark">
          <thead>
          <tr>
            <th scope="col">#</th>
            {!this.props.hideFiled && <th scope="col">賣出</th>}
            {this.props.saleStatus !== 'sale' ? <th scope="col">購買日期</th> :  <th scope="col">賣出日期</th> }
            <th scope="col">股票名稱</th>
            <th scope="col">編號</th>
            <th scope="col">平均單價</th>
            <th scope="col">張數</th>
            <th scope="col">手續費</th>
            <th scope="col">購買成本</th>
            <th scope="col">狀態</th>
            <th scope="col">賣出總價</th>
            <th scope="col">損益</th>
            <th scope="col">刪除</th>
          </tr>
          </thead>
          <tbody>
          {
            !!allStocks && (allStocks.length !== 0) && allStocks.map((stock, index) => (
            <Stock hideFiled={this.props.hideFiled} saleStatus={this.props.saleStatus} key={stock.number+index} stock={stock} index={index+1} stockSaleCallback = {this.props.saleStockCallback}delete={index => this.delete(index)}/>
            ))
          }
          </tbody>
        </table>
      </div>
      </div>
    )
  }
}
