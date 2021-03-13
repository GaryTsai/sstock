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
import api from './api/api'

const initialState = {
  inputData: [],
  unSaleStocks: [],
  saleStocks: [],
  allStocks: [],
  showStocks: [],
  totalCost: 0,
  route: 'home',
  profitAndLoss: 0,
  profit: 0,
  saleCost: 0,
  saleIsOpen: false,
  saleStatus: 'all'
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.updateAllData(this.props.route);
  }

  updateAllData = route => {
    if(route === "US_account") {
      api.getAllData(route).then((stockData) => {
          this.setState({
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
      api.getAllData(route).then((stockData) => {
          this.setState({
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
    const {route} = this.state;
    api.insertNewData(data).then(() => {
      self.updateAllData(route)
    });
  };

  deleteStock = (timestamp) => {
    const {route} = this.state;
    api.deleteStock(timestamp).then(() =>
      this.updateAllData(route)
    )
  };

  saleStock = (salePrice, saleSheet, stock) => {
    const {route} = this.state;
    api.updateStock(salePrice, saleSheet, stock, route).then(() => {
        const stockInfo ={'price':salePrice, 'sheet':saleSheet, 'cost': stock.cost};
        api.updateAccountRecord(stockInfo, false, route);
        this.updateAllData(route)
      }
    )
  };

  changeRoute = (route) => {
    this.setState({route: route});
    this.updateAllData(route);
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
          result = allStocks.filter(a => (startRegion <= a.date && a.date <= endRegion));
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
  reset = () => this.updateAllData(this.props.route);

  saleIsOpen = () => this.setState({saleIsOpen: !this.state.saleIsOpen});

  getSaleIsStatus = () => {
    if (!browserUtils.isMobile()) {
      return true
    } else {
      return this.state.saleIsOpen;
    }
  };

  render() {
    const inputData = this.state.inputData;
    const unSaleStocks = this.state.unSaleStocks;
    const showStocks = this.state.showStocks;
    const {route} = this.state;

    return (
      <div className="App" style={{
        height: window.innerHeight,
        margin: '0 auto',
      }}>
        <Navbar totalCost={this.state.totalCost} profitAndLoss={this.state.profitAndLoss} route={route} changeRoute={this.changeRoute} profit={this.state.profit} saleCost={this.state.saleCost}/>
        {browserUtils.isMobile() && !this.state.saleIsOpen && (route === 'home' || route === 'US_account' ) && <button className="btn btn-warning from-group col-md-2 input-sale-frame" type="submit" onClick={() => this.saleIsOpen(true)}>買入</button>}
        {browserUtils.isMobile() && this.state.saleIsOpen && (route === 'home' || route === 'US_account' ) && <button className="btn btn-secondary from-group col-md-2 input-sale-frame" type="submit" onClick={() => this.saleIsOpen(false)}>隱藏</button>}
        {this.getSaleIsStatus() && (route === 'home' || route === 'US_account' ) && <Input callback={this.inputData} route={route}/>}
        {route === 'home' && <Stocks hideFiled={false} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={unSaleStocks} deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={route}/>}
        {route === 'summary' && <Stocks hideFiled={true} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={showStocks} deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={route} queryDataCallback={this.updateQueryData} resetCallBack={this.reset}/>}
        {route === 'US_account' && <Usstocks hideFiled={false} saleStatus={'US_all'} UsInfo={'US_home'} route={route} allStocks={showStocks} saleStockCallback={this.saleStock}  deleteCallback={this.deleteStock} queryDataCallback={this.updateQueryData} resetCallBack={this.reset} />}
        {route === 'account' && <Account route={route}/>}

      </div>
    )
  }
}