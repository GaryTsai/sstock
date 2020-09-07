import React, {Component} from 'react';

import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import Navbar from './component/navbar';
import Input from './component/input';
import Stocks from './component/stocks';
import firebaseConfig from './settings/firebaseConfig';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import "firebase/database";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import utils from "./utils/dateFormat";
import browserUtils from "./utils/browserUtils";
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
    saleCost:0,
    saleIsOpen: false,
};


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    this.updateAllData();
    console.log(browserUtils.isMobile());
  }

  updateAllData = () =>{
    let getDataRef = firebase.database().ref(`/expense/stockInfo` );
    let self =this;
    getDataRef.once('value').then( (snapshot) => {
      let items = [];
      snapshot.forEach(element => {
        items.unshift(element.val());
      });
      let stocks = items.sort(function (a, b) {
        return a.date < b.date ? 1 : -1
      });
      let unSaleStocks = stocks.filter(a => a.status !=='sale').sort(function (a, b) {
        return a.sale_date < b.sale_date ? 1 : -1
      });
      let saleStocks = stocks.filter(a => a.status ==='sale').sort(function (a, b) {
        return a.sale_date < b.sale_date ? 1 : -1
      });

      if(!!items) {
        let total = 0;
        let profitAndLoss =0;
        let saleCost =0;
        for (let item in items) {
          total += items[item].status === "unsale" ? items[item].cost : 0;
        }
        for (let item in items) {
          profitAndLoss += items[item].status === "sale" ? items[item].income : 0;
          saleCost += items[item].status === "sale" ? items[item].cost : 0;

        }
        self.setState({showStocks:items, allStocks:items, saleStocks:saleStocks, unSaleStocks: unSaleStocks, totalCost: total, profitAndLoss:profitAndLoss, saleCost: saleCost, profit:(profitAndLoss/saleCost*100).toFixed(2)})
      }
    });
  };


  inputData = data =>{
    let self =this;
    let postRef = firebase.database().ref(`/expense/stockInfo`);
    let timestamp = Math.floor(Date.now() / 1000);
    postRef.child(timestamp.toString()).set({
      timestamp: timestamp,
      date: data.date,
      name: data.name,
      number: data.number,
      price: data.price,
      sheet: data.sheet,
      cost: Math.round(data.price * 1000 * data.sheet * 1.001425),
      income:0,
      sale_cost:0,
      sale_date:0,
      sale_price:0,
      sale_sheet:0,
      status:"unsale"

    }).then(function () {
      console.log("新增Post成功");
      self.updateAllData();
    }).catch(function (err) {
      console.error("新增Post錯誤：", err);
    });
    // this.setState({inputData:data});
  };

  deleteStock = (timestamp) => {
    let delRef = firebase.database().ref(`/expense/stockInfo`);
    let self = this ;
    delRef.child(`${timestamp}`).remove().then(function () {
      console.log("刪除成功");
      self.updateAllData();
    }).catch(function (err) {
      console.error("刪除錯誤：", err);
    });
  };
  saleStock = (salePrice, saleSheet, stock) =>{
    let setDate = firebase.database().ref(`expense/stockInfo/${stock.timestamp}`);
    setDate.update({
      income: Math.round(salePrice * 1000 * saleSheet - salePrice * 1000 * saleSheet * 0.004425 -  stock.cost),
      sale_cost: Math.round(salePrice * 1000 * saleSheet - salePrice * 1000 * saleSheet * 0.004425),
      sale_date: this.getFormatDate(new Date()),
      sale_price: salePrice,
      sale_sheet: saleSheet,
      status: "sale"
    });
    this.updateAllData();
  };

  changeRoute = (route) =>{
   this.setState({route:route})
  };

  getFormatDate = date => {
    const year = date.getFullYear();
    const month = utils.toDualDigit(date.getMonth() + 1);
    const day = utils.toDualDigit(date.getDate());

    return year + '-' + month + '-' + day
  };
  updateQueryData = (stockInfo) =>{
    const {allStocks ,unSaleStocks,saleStocks}= this.state;
    const startRegion = stockInfo.dateRegion1;
    const endRegion = stockInfo.dateRegion2;
    let total = 0;
    let profit = 0;
    let saleCost = 0;
    let profitAndLoss = 0;
    this.setState({saleStatus:stockInfo.saleStatus});
    if(stockInfo.stockStatus === 'individual'){
      switch(stockInfo.saleStatus){
        case 'all':
          let all = allStocks.filter(a => (startRegion <= a.date && a.date <= endRegion));
          for (let item in all) {
            total += all[item].cost;
            profitAndLoss += all[item].income;
            saleCost += all[item].sale_cost;
          }
          for (let item in all) {
            profit = (profitAndLoss/saleCost*100).toFixed(2)
          }
          this.setState({showStocks:all, profit:profit, saleCost:saleCost, profitAndLoss:profitAndLoss});
          break;
        case 'sale':
          let sale = saleStocks.filter(a => startRegion <= a.date && a.date <= endRegion );
          for (let item in sale) {
            total += sale[item].cost;
            profitAndLoss += sale[item].income;
            saleCost += sale[item].sale_cost;
          }
          for (let item in sale) {
            profit = (profitAndLoss/saleCost*100).toFixed(2)
          }
          this.setState({showStocks: sale, profit:profit, saleCost:saleCost, profitAndLoss:profitAndLoss});
          break;
        case 'unsale':
          let unSale = unSaleStocks.filter(a => startRegion <= a.date && a.date <= endRegion );
          for (let item in unSale) {
            total += unSale[item].cost;
            profitAndLoss += unSale[item].income;
            saleCost += unSale[item].sale_cost;
          }
          for (let item in unSale) {
            profit = (profitAndLoss/saleCost*100).toFixed(2)
          }
          this.setState({showStocks:unSale, profit:profit, saleCost:saleCost, profitAndLoss:profitAndLoss});
          break;
        default:
          let defaultAll = allStocks.filter(a => startRegion <= a.date <= endRegion );
          this.setState({showStocks:defaultAll});

      }
    }
    else if (stockInfo.stockStatus === 'mutual'){

    }
  };
  reset = () => this.updateAllData();

  saleIsOpen = () => this.setState({saleIsOpen:!this.state.saleIsOpen});

  getSaleIsStatus = () =>{
    if(!browserUtils.isMobile()){
      return true
    }else{
      return this.state.saleIsOpen;
    }
  };

    render() {
    const inputData = this.state.inputData;
    const unSaleStocks = this.state.unSaleStocks;
    const showStocks = this.state.showStocks;
    console.log(showStocks);
    return (
      <div className="App" style={{
        height: window.innerHeight,
        margin: '0 auto',
      }}>
        <Navbar totalCost={this.state.totalCost} profitAndLoss={this.state.profitAndLoss} route={this.state.route} changeRoute={this.changeRoute} profit={this.state.profit} saleCost={this.state.saleCost}/>
        { browserUtils.isMobile() && !this.state.saleIsOpen && this.state.route === 'home' && <button className="btn btn-warning from-group col-md-2 input-sale-frame" type="submit"  onClick={() => this.saleIsOpen(true)}>買入</button>}
        { browserUtils.isMobile() && this.state.saleIsOpen && this.state.route === 'home' && <button className="btn btn-secondary from-group col-md-2 input-sale-frame" type="submit"  onClick={() => this.saleIsOpen(false)}>隱藏</button>}
        { this.getSaleIsStatus() && this.state.route === 'home' && <Input callback={this.inputData} />}
        {this.state.route === 'home' && <Stocks hideFiled={false} inputData={inputData} allStocks={unSaleStocks} deleteCallback={this.deleteStock} saleStockCallback={this.saleStock}/>}
        {this.state.route === 'summary' && <Stocks hideFiled={true} saleStatus={this.state.saleStatus} inputData={inputData} allStocks={showStocks} deleteCallback={this.deleteStock} saleStockCallback={this.saleStock} route={this.state.route}
                                                   queryDataCallback={this.updateQueryData} resetCallBack={this.reset}/>}
      </div>
    )
  }
}