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
  route: 'Taiwan_account',
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
    const {route} = this.state;
    settings.route = route;
    // if(route === "US_account") {
    //   settings.country = 'us';
    //   api.getAllData().then((stockData) => {
    //       this.setState({
    //         lastYearROI: stockData.lastYearROI,
    //         saleStatus: 'US_all',
    //         showStocks: stockData.showStocks,
    //         allStocks: stockData.allStocks,
    //         saleStocks: stockData.saleStocks,
    //         unSaleStocks: stockData.unSaleStocks,
    //         totalCost: stockData.totalCost,
    //         profitAndLoss: stockData.profitAndLoss,
    //         saleCost: stockData.saleCost,
    //         profit: (stockData.profitAndLoss / stockData.saleCost * 100).toFixed(2),
    //         loading: false
    //       })
    //     }
    //   );
    // }else{
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
    api.insertNewData(data, route).then(() => {
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
      const stockInfo = {'price': salePrice, 'sheet': saleSheet, 'cost': stock.cost, 'date': stock.date};
      api.updateAccountRecord(stockInfo, true, route);
      this.updateAllData()
      }
    )
  };

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
    localStorage.removeItem('account-sstock');
    this.setState({logInStatus: false})
  };

  changeRoute = (route) => {
    switch (route) {
      case 'twChart':
      case 'Taiwan_history':
      case 'Taiwan_account':
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
          {browserUtils.isMobile() && !this.state.saleIsOpen && (route === 'Taiwan_account' || route === 'US_account') &&
          <button className="btn btn-warning from-group col-md-2 input-sale-frame" type="submit"
                  onClick={() => this.saleIsOpen(true)}>買入</button>}
          {browserUtils.isMobile() && this.state.saleIsOpen && (route === 'Taiwan_account' || route === 'US_account') &&
          <button className="btn btn-secondary from-group col-md-2 input-sale-frame" type="submit"
                  onClick={() => this.saleIsOpen(false)}>隱藏</button>}
          {this.getSaleIsStatus() && (route === 'Taiwan_account' || route === 'US_account') &&
          <Input callback={this.inputData} route={route}/>}
          {route === 'Taiwan_account' &&
          <Stocks hideFiled={false} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={result}
                  deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={route} isMerge={isMerge}/>}
          {route === 'twChart' &&<TwChart hideFiled={false} allStocks={showStocks} route={route}/>}
          {route === 'Taiwan_history' &&
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