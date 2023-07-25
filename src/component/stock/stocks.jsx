import React, { useEffect, useState } from 'react';
import Stock from './stock';
import InputRegion from "../inputRegion";
import browserUtils from "../../utils/browserUtils";

const initialState = {
  allData:[],
  allStocks:"",
  isQueryOpen: false,
  isTopBtnShow: false
};
const Stocks = (props) => {
  const [stockInfo, setStockInfo] = useState(initialState)

  useEffect(()=> {
    const {allStocks} = props;
    if (allStocks) {
      setStockInfo({allStocks: allStocks, ...stockInfo})
    }

  },[])

  const queryData = (stockInfo) => props.queryDataCallback(stockInfo);

  const checkQueryOpen = status => setStockInfo({ isQueryOpen:status, ...stockInfo });

  const getQueryStatus = () =>{
    if(!browserUtils.isMobile()){
      return true
    }else{
      return stockInfo.isQueryOpen;
    }
  };
  const { allStocks, deleteCallback, queryDataCallback, saleStockCallback, resetCallBack, hideFiled, saleStatus, route, isMerge }= props;
  const { isQueryOpen }= stockInfo;
  const isMobile = browserUtils.isMobile();
  const isShowQueryOption = route === 'Taiwan_history';

  return (
    <div>
      {isShowQueryOption && !isQueryOpen && isMobile && <button style={{borderRadius: '0px'}} className="btn btn-success from-group col-sm-2 col-md-12" type="submit" onClick={() => checkQueryOpen(true)}>查詢時區</button>}
      {isShowQueryOption && isQueryOpen && isMobile && <button style={{borderRadius: '0px'}} className="btn btn-secondary from-group col-sm-2 col-md-12" type="submit" onClick={() => checkQueryOpen(false)}>隱藏</button>}
      {isShowQueryOption && getQueryStatus() && <InputRegion callback={queryDataCallback} resetCallBack={resetCallBack}/>}
      <div style={{overflowY: browserUtils.isMobile() ? 'scroll' : 'unset'}}>
      <table className="table table-dark" style={{whiteSpace: 'nowrap'}}>
        <thead>
        <tr>
          <th scope="col">#</th>
          {!hideFiled && isMerge === false &&<th scope="col">賣出</th>}
          { saleStatus !== 'all' &&((saleStatus === 'sale') ? <th scope="col">賣出日期</th> : <th scope="col">購買日期</th> )}
          {(saleStatus === 'all' && route !== 'Taiwan_account') && <th scope="col">賣出日期</th>}
          { saleStatus === 'all'  && isMerge === false && <th scope="col">購買日期</th>}
          <th scope="col">股票名稱</th>
          <th scope="col">編號</th>
          <th scope="col">平均單價</th>
          <th scope="col">張數</th>
          <th scope="col">手續費</th>
          <th scope="col">購買成本</th>
          <th scope="col">狀態</th>
          <th scope="col">賣出總價</th>
          <th scope="col">損益</th>
          { isMerge === false &&<th scope="col">刪除</th> }
        </tr>
        </thead>
        <tbody>
        {
          (allStocks.length !== 0) && allStocks.map((stock, index) => (
          <Stock hideFiled={hideFiled} saleStatus={saleStatus} key={stock.number+index} stock={stock} index={index+1} route={route} stockSaleCallback = {saleStockCallback} delete={index => deleteCallback(index)} isMerge = {isMerge}/>
          ))
        }
        </tbody>
      </table>
    </div>
    </div>
  )
}


export default Stocks