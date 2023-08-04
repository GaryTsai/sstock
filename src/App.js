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
  saleIsOpen: false,
  saleStatus: 'all',
  lastYearROI: 0,
  logInStatus: false,
  loading: false,
  isMerge: false
  
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.loginRecord();
    if(this.state.logInStatus) {
      this.updateAllData();
    }
  }

  updateAllData = () => {
      api.getAllData().then((stockData) => {
        settings.country = 'tw';
          this.setState({
            lastYearROI: stockData.lastYearROI,
            saleStatus: 'all',
            showStocks: stockData.showStocks.length === 0 ? 'No Data' : stockData.showStocks,
            allStocks: stockData.allStocks,
            saleStocks: stockData.saleStocks,
            unSaleStocks: stockData.unSaleStocks,
            totalCost: stockData.totalCost,
            profitAndLoss: stockData.profitAndLoss,
            saleCost: stockData.saleCost,
            profit: (stockData.profitAndLoss / stockData.saleCost * 100).toFixed(2),
            loading: false
          })
        }
      );
    // }
  };

  inputData = data => {
    let self = this;
    const route = this.state.route
    api.insertNewData(data).then(() => {
      self.updateAllData()
    });
  };

  deleteStock = (stock) => {
    api.deleteStock(stock.timestamp).then(() =>
      this.updateAllData(),
      this.updateDataForDeleteStock(stock)
    )
  };

  saleStock = (salePrice, saleSheet, stock) => {
    api.updateStock(salePrice, saleSheet, stock).then(() => {
      const stockInfo = {'price': salePrice, 'sheet': saleSheet, 'cost': stock.cost, 'date': stock.date};
      api.updateAccountRecord(stockInfo, true);
      this.updateAllData()
      }
    )
  };

  updateDataForDeleteStock = async stock => {
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
            record.account_record_Money = Number(record.account_record_Money) + deleteRecord[timestamp].transfer
            record.account_record_Stock = Number(record.account_record_Stock) - deleteRecord[timestamp].transfer
          } else {
            record.account_record_Money = Number(record.account_record_Money) - deleteRecord[timestamp].transfer
            record.account_record_Stock = Number(record.account_record_Stock) + deleteRecord[timestamp].transfer
          }
        }
    });
    firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}`).update({'account_record':newRecords})
    
    api.getAccount().then(async (account)=> {
        let getRefOfAccount = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_summary` );  
        let accountMoney = parseInt(account.accountMoney)
        let accountStock = parseInt(account.accountStock)

        if(deleteRecord[timestamp].transferStatus === '存入') {
          accountMoney += deleteRecord[timestamp].transfer
          accountStock -= deleteRecord[timestamp].transfer
        } else {
          accountMoney -= deleteRecord[timestamp].transfer
          accountStock += deleteRecord[timestamp].transfer
        }
        await getRefOfAccount.update({
          accountMoney: accountMoney.toFixed(0),
          accountStock: accountStock.toFixed(0),
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

  loginRecord = () =>{
    const account = localStorage.getItem('account-stock');
    if(!!account) {
      settings.user_id = account;
      this.closeLoginPage();
      this.updateAllData();
    }
    else return;
  };

  logOut = () =>{
    localStorage.removeItem('account-stock');
    this.setState({logInStatus: false})
  };

  changeRoute = (route) => {
    switch (route) {
      case 'balanceChart':
      case 'stockHistory':
      case 'accountInfo':
        settings.country = 'tw';
        break;
      // case 'US_account':
      // case 'US_history':
      //   settings.country = 'us';
        break;
    }
    this.setState({route: route, showStocks: []}, ()=>this.updateAllData());
  };
  
  infoMerge = (datas) => {
    const result = datas.reduce((mergeResult, prev, next) => {
      const isNotExist = mergeResult && mergeResult.filter((item)=>_.trim(item.number) === _.trim(prev.number)).length === 0
      if(isNotExist){
        mergeResult.push({
          cost: prev.cost,
          income: 0,
          name: prev.name,
          number: prev.number,
          price: Number(prev.price) * Number(prev.sheet),
          sale_cost: 0,
          sale_date: 0,
          sale_price: 0,
          sale_sheet: 0,
          sheet: Number(prev.sheet),
          status: "unsale"
        })
      } else {
        const index = _.findIndex(mergeResult, (e) => _.trim(e.number) === _.trim(prev.number), 0); 
        mergeResult[index] = {
          ...mergeResult[index],
          cost: Math.round(Number(mergeResult[index].cost) + Number(prev.cost), 2),
          price: Number(mergeResult[index].price) + (Number(prev.price)*Number(prev.sheet)),
          sheet: Number(mergeResult[index].sheet) + Number(prev.sheet),
        }
      }
      return mergeResult
    }, [])

    return result
  } 

  updateQueryData = (stockInfo) => {
    const {allStocks, unSaleStocks, saleStocks} = this.state;
    const startRegion = stockInfo.dateRegion1;
    const endRegion = stockInfo.dateRegion2;

    let profit = 0;
    let saleCost = 0;
    let profitAndLoss = 0;
    let result = '';

    this.setState({saleStatus: stockInfo.saleStatus});
    if (stockInfo.stockStatus === 'individual') {
      switch (stockInfo.saleStatus) {
        case 'all':
          result = allStocks.filter(a => (startRegion <= a.sale_date && a.sale_date <= endRegion));
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

      this.setState({showStocks: result.length === 0 ? 'No Data' : result, profit: profit, saleCost: saleCost, profitAndLoss: profitAndLoss});
    } else if (stockInfo.stockStatus === 'mutual') {
    }
  };
  reset = () => this.updateAllData();

  saleIsOpen = () => this.setState({saleIsOpen: !this.state.saleIsOpen});

  getSaleIsStatus = () => {
    if (!browserUtils.isMobile()) {
      return true
    } else {
      return this.state.saleIsOpen;
    }
  };

  handleMerge = () => this.setState({isMerge: !this.state.isMerge})

  closeLoginPage = () => this.setState({logInStatus: true, loading: true});

  render() {
    const inputData = this.state.inputData;
    const unSaleStocks = this.state.unSaleStocks;
    const showStocks = this.state.showStocks;
    const {route, logInStatus, lastYearROI, loading, isMerge} = this.state;
    const result = isMerge ? this.infoMerge(unSaleStocks) : unSaleStocks

    if(!logInStatus){
      return (
        <div>
      <Login logInCallBack ={() => this.updateAllData()} homePageCallBack={this.closeLoginPage}/>
        </div>
      )
    }else {
      return (
        <div className="App" style={{
          height: window.innerHeight,
          margin: '0 auto',
        }}>
          {loading === true &&<div style={{position: 'absolute',
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
          <Navbar lastYearROI={lastYearROI} totalCost={this.state.totalCost} profitAndLoss={this.state.profitAndLoss}
                  route={route} changeRoute={this.changeRoute} profit={this.state.profit} logOutCallBack={this.logOut}
                  saleCost={this.state.saleCost} handleMerge={this.handleMerge} isMerge={isMerge}/>
          {browserUtils.isMobile() && !this.state.saleIsOpen && (route === 'accountInfo') &&
          <button className="btn btn-warning from-group col-sm-2 col-md-12 input-sale-frame" type="submit"
                  onClick={() => this.saleIsOpen(true)}>買入</button>}
          {browserUtils.isMobile() && this.state.saleIsOpen && (route === 'accountInfo') &&
          <button className="btn btn-secondary from-group col-sm-2 col-md-12 input-sale-frame" type="submit"
                  onClick={() => this.saleIsOpen(false)}>隱藏</button>}
          {this.getSaleIsStatus() && (route === 'accountInfo') &&
          <Input callback={this.inputData} route={route}/>}
          {route === 'accountInfo' &&
          <Stocks hideFiled={false} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={result}
                  deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={route} isMerge={isMerge}/>}
          {route === 'balanceChart' &&<TwChart hideFiled={false} allStocks={showStocks} route={route}/>}
          {route === 'stockHistory' &&
          <Stocks hideFiled={true} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={showStocks}
                  deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={route}
                  queryDataCallback={this.updateQueryData} resetCallBack={this.reset} isMerge={false}/>}
          {/* {route === 'US_account' &&
          <Usstocks hideFiled={false} saleStatus={'US_all'} route={route} allStocks={showStocks}
                    saleStockCallback={this.saleStock} deleteCallback={this.deleteStock}
                    queryDataCallback={this.updateQueryData} resetCallBack={this.reset}/>} */}
          {route === 'account' && <Account route={route}/>}
        </div>
      )
    }
  }
}