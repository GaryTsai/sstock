import React, {Component} from 'react';

import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import Account from './component/account/account';
import Navbar from './component/navbar/navbar';
import Input from './component/input';
import Stocks from './component/stock/stocks';
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
    this.updateAllData();
  }

  updateAllData = () => {
    api.getAllData().then((stockData) => {
        this.setState({
          saleStatus: 'all',
          showStocks: stockData.showStocks,
          allStocks: stockData.allStocks,
          saleStocks: stockData.saleStocks,
          unSaleStocks: stockData.unSaleStocks,
          totalCost: stockData.totalCost,
          profitAndLoss: stockData.profitAndLoss,
          saleCost: stockData.saleCost,
          profit: (stockData.profitAndLoss / stockData.saleCost * 100).toFixed(2)
        })
      }
    );
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
    console.log(salePrice, saleSheet, stock);
    api.updateStock(salePrice, saleSheet, stock).then(() => {
        const stockInfo ={'price':salePrice, 'sheet':saleSheet, 'cost': stock.cost};
        api.updateAccountRecord(stockInfo, false);
        this.updateAllData()
      }
    )
  };

  changeRoute = (route) => this.setState({route: route});


  updateQueryData = (stockInfo) => {
    const {allStocks, unSaleStocks, saleStocks} = this.state;
    const startRegion = stockInfo.dateRegion1;
    const endRegion = stockInfo.dateRegion2;

    let profit = 0;
    let saleCost = 0;
    let profitAndLoss = 0;
    let result = '';
    console.log(allStocks);

    this.setState({saleStatus: stockInfo.saleStatus});
    if (stockInfo.stockStatus === 'individual') {
      switch (stockInfo.saleStatus) {
        case 'all':
          result = allStocks.filter(a => (startRegion <= a.date && a.date <= endRegion));
          // result = result.concat(allStocks.filter(a => (startRegion <= a.sale_date && a.sale_date <= endRegion)));
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
        console.log(result[item].income);
        profitAndLoss += result[item].income;
        saleCost += result[item].sale_cost;
      }
      profit = (profitAndLoss / saleCost * 100).toFixed(2)
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

  render() {
    const inputData = this.state.inputData;
    const unSaleStocks = this.state.unSaleStocks;
    const showStocks = this.state.showStocks;

    return (
      <div className="App" style={{
        height: window.innerHeight,
        margin: '0 auto',
      }}>
        <Navbar totalCost={this.state.totalCost} profitAndLoss={this.state.profitAndLoss} route={this.state.route}
                changeRoute={this.changeRoute} profit={this.state.profit} saleCost={this.state.saleCost}/>
        {browserUtils.isMobile() && !this.state.saleIsOpen && this.state.route === 'home' &&
        <button className="btn btn-warning from-group col-md-2 input-sale-frame" type="submit"
                onClick={() => this.saleIsOpen(true)}>買入</button>}
        {browserUtils.isMobile() && this.state.saleIsOpen && this.state.route === 'home' &&
        <button className="btn btn-secondary from-group col-md-2 input-sale-frame" type="submit"
                onClick={() => this.saleIsOpen(false)}>隱藏</button>}
        {this.getSaleIsStatus() && this.state.route === 'home' && <Input callback={this.inputData}/>}
        {this.state.route === 'home' &&
        <Stocks hideFiled={false} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={unSaleStocks} deleteCallback={this.deleteStock}
                saleStockCallback={this.saleStock} route={this.state.route}/>}
        {this.state.route === 'summary' &&
        <Stocks hideFiled={true} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={showStocks}
                deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={this.state.route}
                queryDataCallback={this.updateQueryData} resetCallBack={this.reset}/>}
        {this.state.route === 'account' && <Account/>}
      </div>
    )
  }
}