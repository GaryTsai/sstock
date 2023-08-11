import React, {Component} from 'react';

import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import "firebase/database";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import Account from './component/account/account';
import Navbar from './component/navbar/navbar';
import Input from './component/input';
import Stocks from './component/stock/stocks';
import browserUtils from "./utils/browserUtils";
import Login from './component/login/login';
import settings from './component/settings/settings'
import TwChart from './component/twChart'
import api from './api/api'
import _ from 'lodash'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeLoading, changeLoginStatus, changeStockMergeState, changeContentLoading} from './slices/mutualState';

const initialState = {
  inputData: [],
  unSaleStocks: [],
  saleStocks: [],
  allStocks: [],
  showStocks: [],
  totalCost: 0,
  route: 'accountInfo',
  profitAndLoss: 0,
  profit: 0,
  saleCost: 0,
  isSaleOpen: false,
  saleStatus: 'all',
  lastYearROI: 0, 
};

const App = () => {
  const [accountInfo, setAccountInfo] = useState(initialState)
  const dispatch = useDispatch();
  const { logInStatus, loading, isMerge, contentLoading } = useSelector((state) => state.mutualStateReducer)
  useEffect(() => {
    dispatch(changeLoading(true))
    loginRecord();
  }, [])

  useEffect(()=>{
      logInStatus && updateAllData();
  }, [logInStatus, accountInfo.route])

  const updateAllData = () => {
    api.getAllData().then((stockData) => {
      settings.country = 'tw';
      setAccountInfo({
          ...accountInfo,
          lastYearROI: stockData.lastYearROI,
          saleStatus: 'all',
          showStocks: stockData.showStocks.length === 0 ? 'No Data' : stockData.showStocks,
          allStocks: stockData.allStocks,
          saleStocks: stockData.saleStocks,
          unSaleStocks: stockData.unSaleStocks,
          totalCost: stockData.totalCost,
          profitAndLoss: stockData.profitAndLoss,
          saleCost: stockData.saleCost,
          profit: (stockData.profitAndLoss / stockData.saleCost * 100).toFixed(2)
      })
      dispatch(changeContentLoading(false))
      dispatch(changeLoading(false))
    });
  };

  const handleInputData = data => {
    dispatch(changeContentLoading(true))
    api.insertNewData(data).then(() => {
      updateAllData()
    });
  };

  const deleteStock = (stock) => {
    api.deleteStock(stock.timestamp).then(() =>
      updateAllData(),
      updateDataForDeleteStock(stock)
    )
  };

  const saleStock = (salePrice, saleSheet, stock) => {
    api.updateStock(salePrice, saleSheet, stock).then(() => {
      const stockInfo = {'price': salePrice, 'sheet': saleSheet, 'cost': stock.cost, 'date': stock.date};
      api.updateAccountRecord(stockInfo, true);
      updateAllData()
      }
    )
  };

  const updateDataForDeleteStock = async stock => {
    //get all account data
    let accountRecord = [];
    let accountInfo = [];
    let timestamp = stock.timestamp

    let getAccountRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}` );
    await getAccountRef.once('value').then((snapshot) => {
      snapshot.forEach(element => {
        accountInfo.unshift(element.val());
      });
        accountRecord = accountInfo[2]
      });
    const deleteRecord = Object.fromEntries(Object.entries(accountRecord).filter(([key]) => key.includes(timestamp)))
    let newRecords = Object.fromEntries(Object.entries(accountRecord).filter(([key]) => !key.includes(timestamp)))
    Object.entries(newRecords).forEach(([key, record] )=> {
        if(deleteRecord[timestamp].timestamp < record.timestamp) {
          if(deleteRecord[timestamp].transferStatus === '存入') {
            record.account_record_Money = record.account_record_Money + deleteRecord[timestamp].transfer
            record.account_record_Stock = record.account_record_Stock - deleteRecord[timestamp].transfer
          } else {
            record.account_record_Money = record.account_record_Money - deleteRecord[timestamp].transfer
            record.account_record_Stock = record.account_record_Stock + deleteRecord[timestamp].transfer
          }
        }
    });
    firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}`).update({'account_record':newRecords})
    
    api.getAccount().then(async (account)=> {
        let getRefOfAccount = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_summary` );  
        let accountMoney = account.accountMoney
        let accountStock = account.accountStock

        if(deleteRecord[timestamp].transferStatus === '存入') {
          accountMoney += deleteRecord[timestamp].transfer
          accountStock -= deleteRecord[timestamp].transfer
        } else {
          accountMoney -= deleteRecord[timestamp].transfer
          accountStock += deleteRecord[timestamp].transfer
        }
        await getRefOfAccount.update({
          accountMoney: accountMoney,
          accountStock: accountStock
        });
      });
    await firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/stock_info`).child(timestamp).update({
      ...stock,
      income: 0,   
      sale_cost: 0,
      sale_date:'',
      sale_price: 0,
      sale_sheet: 0,
      status: "unsale"
    });
  }

  const loginRecord = () =>{
    const account = localStorage.getItem('account-stock');
    if(!!account) {
      settings.user_id = account;
      closeLoginPage();
    }
  };

  const logOut = async () =>{
    localStorage.removeItem('account-stock');
    dispatch(changeLoginStatus())
    setAccountInfo({
      ...accountInfo,
      logInStatus: false
    })
  };

  const changeRoute = (route) => {
    if(accountInfo.route === route) 
      return
    switch (route) {
      case 'balanceChart':
      case 'stockHistory':
      case 'accountInfo':
      case 'account':
        dispatch(changeLoading(true))
        settings.country = 'tw';
        break;
    }
    setAccountInfo({
      ...accountInfo,
      route: route,
      showStocks: []
    })
  };
  
  const infoMerge = (datas) => {
    const result = datas.reduce((mergeResult, prev, next) => {
      const isNotExist = mergeResult && mergeResult.filter((item)=>_.trim(item.number) === _.trim(prev.number)).length === 0
      if(isNotExist){
        mergeResult.push({
          cost: prev.cost,
          income: 0,
          name: prev.name,
          number: prev.number,
          price: prev.price * prev.sheet,
          sale_cost: 0,
          sale_date: 0,
          sale_price: 0,
          sale_sheet: 0,
          sheet: prev.sheet,
          status: "unsale"
        })
      } else {
        const index = _.findIndex(mergeResult, (e) => _.trim(e.number) === _.trim(prev.number), 0); 
        mergeResult[index] = {
          ...mergeResult[index],
          cost: mergeResult[index].cost + prev.cost,
          price: mergeResult[index].price + (prev.price * prev.sheet),
          sheet: mergeResult[index].sheet + prev.sheet,
        }
      }
      return mergeResult
    }, [])

    return result
  } 

  const updateQueryData = (stockInfo) => {
    const {allStocks, unSaleStocks, saleStocks} = accountInfo;
    const startRegion = stockInfo.dateRegion1;
    const endRegion = stockInfo.dateRegion2;

    let profit = 0;
    let saleCost = 0;
    let profitAndLoss = 0;
    let result = '';

    if (stockInfo.stockStatus === 'individual') {
      switch (stockInfo.saleStatus) {
        case 'all':
          result = allStocks.filter(a => (startRegion <= a.sale_date || startRegion <= a.date) && (a.date <= endRegion || a.sale_date <= endRegion));
          break;
        case 'sale':
          result = saleStocks.filter(a => startRegion <= a.sale_date && a.sale_date <= endRegion);
          break;
        case 'unsale':
          result = unSaleStocks.filter(a => startRegion <= a.date && a.date <= endRegion);
          break;
        default:
          break;
      }

      for (let item in result) {
        profitAndLoss += result[item].income;
        saleCost += result[item].cost;
      }
      profit = (profitAndLoss / saleCost * 100).toFixed(2);

      setAccountInfo({...accountInfo, showStocks: result.length === 0 ? 'No Data' : result, profit: profit, saleCost: saleCost, profitAndLoss: profitAndLoss, saleStatus: stockInfo.saleStatus});
    } else if (stockInfo.stockStatus === 'mutual') {
    }
  };
  const reset = () => updateAllData();

  const saleIsOpen = () => setAccountInfo({...accountInfo, isSaleOpen: !accountInfo.isSaleOpen});

  const getSaleIsStatus = () => {
    if (!browserUtils.isMobile()) {
      return true
    } else {
      return accountInfo.isSaleOpen;
    }
  };

  const handleMerge = () => {
    dispatch(changeStockMergeState())
  }
  

  const closeLoginPage = () => {
    dispatch(changeLoginStatus())
    // setAccountInfo({...accountInfo, logInStatus: true, loading: true});
  }

  const { route, lastYearROI, inputData, unSaleStocks, showStocks, totalCost, profitAndLoss, profit, saleCost, isSaleOpen, saleStatus } = accountInfo;
  const result = isMerge ? infoMerge(unSaleStocks) : unSaleStocks

  if(!logInStatus){
      return (
        <div>
      <Login logInCallBack ={() => updateAllData()} homePageCallBack={() => closeLoginPage()}/>
        </div>
      )
  } else {
    return (
      <div className="App" style={{
        height: window.innerHeight,
        margin: '0 auto',
      }}>
        {loading == true &&<div style={{position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          display: 'block',
          zIndex: 7,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'}}><img  alt="" style={{display:'flex',
          width: '128px',
          height: '128px',
          position: 'relative',
          margin: '0px auto',
          backgroundSize: '100%',
          top: 'calc(50% - 50px)'
        }} src={require('./assets/img/loading.gif')}/></div>}
        <Navbar lastYearROI={lastYearROI} totalCost={totalCost} profitAndLoss={profitAndLoss}
                route={route} changeRoute={changeRoute} profit={profit} logOutCallBack={logOut}
                saleCost={saleCost} handleMerge={handleMerge} isMerge={isMerge}/>
        {browserUtils.isMobile() && !isSaleOpen && (route === 'accountInfo') &&
        <button className="btn btn-warning from-group col-sm-2 col-md-12 input-sale-frame" type="submit"
                onClick={() => saleIsOpen(true)}>買入</button>}
        {browserUtils.isMobile() && isSaleOpen && (route === 'accountInfo') &&
        <button className="btn btn-secondary from-group col-sm-2 col-md-12 input-sale-frame" type="submit"
                onClick={() => saleIsOpen(false)}>隱藏</button>}
        {getSaleIsStatus() && (route === 'accountInfo') &&
        <Input callback={handleInputData} route={route}/>}
        {route === 'accountInfo' &&
        <Stocks hideFiled={false} saleStatus={saleStatus} inputData={inputData} allStocks={result}
                deleteCallback={deleteStock} saleStockCallback={saleStock} route={route} isMerge={isMerge}/>}
        {route === 'balanceChart' &&<TwChart hideFiled={false} allStocks={showStocks} route={route}/>}
        {route === 'stockHistory' &&
        <Stocks hideFiled={true} saleStatus={saleStatus} inputData={inputData} allStocks={showStocks}
                deleteCallback={deleteStock} saleStockCallback={saleStock} route={route}
                queryDataCallback={updateQueryData} resetCallBack={reset} isMerge={false}/>}
        {route === 'account' && <Account route={route}/>}
      </div>
    )
  }
}

export default App