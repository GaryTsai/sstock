import React, {Component} from 'react';

import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import Account from './component/account/account';
import Navbar from './component/navbar/navbar';
import Input from './component/input';
import Stocks from './component/stock/stocks';
import Usstocks from './component/usstock/stocks';
import browserUtils from "./utils/browserUtils";
import Login from './component/login/login';
import settings from './component/settings/settings'

import api from './api/api'

const initialState = {
  inputData: [],
  unSaleStocks: [],
  saleStocks: [],
  allStocks: [],
  showStocks: [],
  totalCost: 0,
  route: 'Taiwan_account',
  profitAndLoss: 0,
  profit: 0,
  saleCost: 0,
  saleIsOpen: false,
  saleStatus: 'all',
  lastYearROI: 0,
  logInStatus: false
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
    const {route} = this.state;
    settings.route = route;
    if(route === "US_account") {
      settings.country = 'us';
      api.getAllData().then((stockData) => {
          this.setState({
            lastYearROI: stockData.lastYearROI,
            saleStatus: 'US_all',
            showStocks: stockData.showStocks,
            allStocks: stockData.allStocks,
            saleStocks: stockData.saleStocks,
            unSaleStocks: stockData.unSaleStocks,
            totalCost: stockData.totalCost,
            profitAndLoss: stockData.profitAndLoss,
            saleCost: stockData.saleCost,
            profit: Math.floor(stockData.profitAndLoss / stockData.saleCost * 100)
          })
        }
      );
    }else{
      api.getAllData().then((stockData) => {
        settings.country = 'tw';
          this.setState({
            lastYearROI: stockData.lastYearROI,
            saleStatus: 'all',
            showStocks: stockData.showStocks,
            allStocks: stockData.allStocks,
            saleStocks: stockData.saleStocks,
            unSaleStocks: stockData.unSaleStocks,
            totalCost: stockData.totalCost,
            profitAndLoss: stockData.profitAndLoss,
            saleCost: stockData.saleCost,
            profit: Math.floor(stockData.profitAndLoss / stockData.saleCost * 100)
          })
        }
      );
    }
  };

  inputData = data => {
    let self = this;
    api.insertNewData(data).then(() => {
      self.updateAllData()
    });
  };

  deleteStock = (timestamp) => {
    api.deleteStock(timestamp).then(() =>
      this.updateAllData()
    )
  };

  saleStock = (salePrice, saleSheet, stock) => {
    const {route} = this.state;
    api.updateStock(salePrice, saleSheet, stock, route).then(() => {
        const stockInfo ={'price':salePrice, 'sheet':saleSheet, 'cost': stock.cost};
        api.updateAccountRecord(stockInfo, false, route);
        this.updateAllData()
      }
    )
  };

  loginRecord = () =>{
    const account = localStorage.getItem('account');
    if(!!account) {
      settings.user_id = account;
      this.closeLoginPage();
      this.updateAllData();
    }
    else return;
  };

  logOut = () =>{
    localStorage.removeItem('account');
    this.setState({logInStatus: false})
  };

  changeRoute = (route) => {
    switch (route) {
      case 'Taiwan_history':
      case 'Taiwan_account':
        settings.country = 'tw';
        break;
      case 'US_account':
      case 'US_history':
        settings.country = 'us';
        break;
    }
    this.setState({route: route});
    this.updateAllData();
  };

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
      profit = Math.floor(profitAndLoss / saleCost * 100);
      this.setState({showStocks: result, profit: profit, saleCost: saleCost, profitAndLoss: profitAndLoss});
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

  closeLoginPage = () => this.setState({logInStatus: true});

  render() {
    const inputData = this.state.inputData;
    const unSaleStocks = this.state.unSaleStocks;
    const showStocks = this.state.showStocks;
    const {route, logInStatus, lastYearROI} = this.state;
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
          <Navbar lastYearROI={lastYearROI} totalCost={this.state.totalCost} profitAndLoss={this.state.profitAndLoss}
                  route={route} changeRoute={this.changeRoute} profit={this.state.profit} logOutCallBack={this.logOut}
                  saleCost={this.state.saleCost}/>
          {browserUtils.isMobile() && !this.state.saleIsOpen && (route === 'Taiwan_account' || route === 'US_account') &&
          <button className="btn btn-warning from-group col-md-2 input-sale-frame" type="submit"
                  onClick={() => this.saleIsOpen(true)}>買入</button>}
          {browserUtils.isMobile() && this.state.saleIsOpen && (route === 'Taiwan_account' || route === 'US_account') &&
          <button className="btn btn-secondary from-group col-md-2 input-sale-frame" type="submit"
                  onClick={() => this.saleIsOpen(false)}>隱藏</button>}
          {this.getSaleIsStatus() && (route === 'Taiwan_account' || route === 'US_account') &&
          <Input callback={this.inputData} route={route}/>}
          {route === 'Taiwan_account' &&
          <Stocks hideFiled={false} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={unSaleStocks}
                  deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={route}/>}
          {route === 'Taiwan_history' &&
          <Stocks hideFiled={true} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={showStocks}
                  deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={route}
                  queryDataCallback={this.updateQueryData} resetCallBack={this.reset}/>}
          {route === 'US_account' &&
          <Usstocks hideFiled={false} saleStatus={'US_all'} route={route} allStocks={showStocks}
                    saleStockCallback={this.saleStock} deleteCallback={this.deleteStock}
                    queryDataCallback={this.updateQueryData} resetCallBack={this.reset}/>}
          {route === 'account' && <Account route={route}/>}
        </div>
      )
    }
  }
}