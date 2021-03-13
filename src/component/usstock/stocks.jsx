import React, {Component} from 'react';
import Stock from './stock';
// import InputRegion from "../inputRegion";
import browserUtils from "../../utils/browserUtils";
import InputRegion from "../inputRegion";
const initialState = {
  allData:[],
  allStocks:"",
  isQueryOpen: false
};

export default class Usstocks extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const allStocks = this.props;
    if (allStocks) {
      this.setState({allStocks: allStocks})
    }
  }

  queryData = (stockInfo) => this.props.queryDataCallback(stockInfo);

  isQueryOpen = status => this.setState({isQueryOpen:status});

  getQueryStatus = () =>{
    if(!browserUtils.isMobile()){
      return true
    }else{
      return this.state.isQueryOpen;
    }
  };


  render() {
    const {allStocks, deleteCallback, UsInfo, hideFiled, saleStatus, route, saleStockCallback, queryDataCallback, resetCallBack}= this.props;
    const {isQueryOpen}= this.state;
    const isMobile = browserUtils.isMobile();
    return (
      <div>
        {route === 'US_account' && !isQueryOpen && isMobile && <button style={{borderRadius: '0px',}} className="btn btn-success from-group col-md-2" type="submit" onClick={() => this.isQueryOpen(true)}>查詢時區</button>}
        {route === 'US_account' && isQueryOpen && isMobile && <button style={{borderRadius: '0px'}} className="btn btn-secondary from-group col-md-2" type="submit" onClick={() => this.isQueryOpen(false)}>隱藏</button>}
        {route === 'US_account' && this.getQueryStatus() && <InputRegion callback={queryDataCallback} resetCallBack={resetCallBack}/>}
        <div style={{overflowY: browserUtils.isMobile() ? 'scroll' : 'unset'}}>
        <table className="table table-dark">
          <thead>
          <tr>
            <th scope="col">#</th>
            {!hideFiled && <th scope="col">賣出</th>}
            { saleStatus === 'US_all' && <th scope="col">賣出日期</th>}
            { saleStatus === 'US_all'  && <th scope="col">購買日期</th>}
            <th scope="col">股票名稱</th>
            <th scope="col">代號</th>
            <th scope="col">單價</th>
            <th scope="col">股數</th>
            <th scope="col">購買成本</th>
            <th scope="col">狀態</th>
            <th scope="col">賣出總價</th>
            <th scope="col">損益</th>
            <th scope="col">刪除</th>
          </tr>
          </thead>
          <tbody>
          {
            (allStocks.length !== 0) && allStocks.map((stock, index) => (
            <Stock hideFiled={hideFiled} UsInfo={UsInfo} saleStatus={saleStatus} key={stock.number+index} stock={stock} index={index+1} route={route}  stockSaleCallback = {saleStockCallback} delete={index => deleteCallback(index)}/>
            ))
          }
          </tbody>
        </table>
      </div>
      </div>
    )
  }
}
