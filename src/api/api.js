// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import "firebase/database";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import d from "../utils/dateFormat";

const fireBaseConfig= {
  apiKey: process.env.REACT_APP_APP_KEY,
  authDomain:process.env.REACT_APP_AUTHDOMAIN,
  databaseURL:process.env.REACT_APP_DATABSEURL,
  projectId:process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGEINGSENDERID,
  appId:　process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
};

firebase.initializeApp(fireBaseConfig);
firebase.analytics();
// get database refer
var getDataRef = firebase.database().ref(`/stockInfo` );
var getUSDataRef = firebase.database().ref(`/us_stockInfo` );
var getAccountRef = firebase.database().ref(`/account` );
var getAccountRecordRef = firebase.database().ref(`/accountRecord` );
var getUSAccountRecordRef = firebase.database().ref(`/us_accountRecord` );
var getUSAccountRef = firebase.database().ref(`/us_account` );
var stockData;

const api = {
  async getAllData(route) {
    this.route = route;
    let getRefOfData = route === "US_account" ? getUSDataRef : getDataRef
    await getRefOfData.once('value').then(async (snapshot) => {
      let items = [];
      snapshot.forEach(element => {
        items.unshift(element.val());
      });
      let stocks = items.sort(function (a, b) {
        return a.date < b.date ? 1 : -1
      });
      let unSaleStocks = stocks.filter(a => a.status !== 'sale').sort(function (a, b) {
        return a.date < b.date ? 1 : -1
      });
      let saleStocks = stocks.filter(a => a.status === 'sale').sort(function (a, b) {
        return a.sale_date > b.sale_date ? 1 : -1
      });

      if (!!items) {
        let total = 0;
        let profitAndLoss = 0;
        let saleCost = 0;
        for (let item in items) {
          total += items[item].status === "unsale" ? items[item].cost : 0;
        }
        for (let item in items) {
          profitAndLoss += items[item].status === "sale" ? items[item].income : 0;
          saleCost += items[item].status === "sale" ? items[item].cost : 0;
        }
        let lastYearROI = await this.getLastYearROI(items, route);
        stockData = {
          lastYearROI: lastYearROI,
          showStocks: items,
          allStocks: items,
          saleStocks: saleStocks,
          unSaleStocks: unSaleStocks,
          totalCost: total,
          profitAndLoss: profitAndLoss,
          saleCost: saleCost,
          profit: Math.floor(profitAndLoss / saleCost * 100)
        }
      }
    });
    return stockData;
  },

  async insertNewData(data){
    let timestamp = Math.floor(Date.now() / 1000);
    let cost = Math.floor(data.price * 1000 * data.sheet * 1.001425);
    let US_cost = data.price * data.sheet;

    let getRefOfData = this.route === "US_account" ? getUSDataRef : getDataRef
      await getRefOfData.child(timestamp.toString()).set({
      timestamp: timestamp,
      date: data.date,
      name: data.name,
      number: data.number,
      price: data.price,
      sheet: data.sheet,
      cost: this.route === "US_account" ?　US_cost : cost,
      income:0,
      sale_cost:0,
      sale_date:0,
      sale_price:0,
      sale_sheet:0,
      status:"unsale"
    }).then(function () {
      console.log("新增Post成功");
      // self.updateAllData();
    }).catch(function (err) {
      console.error("新增Post錯誤：", err);
    });
  },

  async deleteStock(timestamp){
    let thisDataRef = this.route === 'US_account' ? getUSDataRef : getDataRef;
    thisDataRef.child(`${timestamp}`).remove().then(function () {
      console.log("刪除成功");
    }).catch(function (err) {
      console.error("刪除錯誤：", err);
    });
  },

  async updateStock(salePrice, saleSheet, stock, route){
      let income = Math.round(salePrice * 1000 * saleSheet) - Math.floor(salePrice * 1000 * saleSheet * 0.001425) - Math.floor(salePrice * 1000 * saleSheet * 0.003) - stock.cost;
      let sale_cost = Math.round(salePrice * 1000 * saleSheet) - Math.floor(salePrice * 1000 * saleSheet * 0.001425) - Math.floor(salePrice * 1000 * saleSheet * 0.003);
      let US_income = salePrice * saleSheet - stock.cost;
      let US_sale_cost = salePrice * saleSheet;
      let sale_date = d.dateFormat(new Date());
      let getRefOfData =  route === "US_account" ? getUSDataRef : getDataRef

      await getRefOfData.child(stock.timestamp).update({
        income: route === 'US_account' ? US_income : income,
        sale_cost: route === 'US_account' ? US_sale_cost　:　sale_cost,
        sale_date: sale_date,
        sale_price: salePrice,
        sale_sheet: saleSheet,
        status: "sale"
      });
  },

  async getAccount(account){
    let accountData = [];
    const thisDataRef = account === 'US_account' ? getUSAccountRef : getAccountRef;

      await thisDataRef.once('value').then((snapshot) => {
        accountData = snapshot.val();
    });
    return accountData;
  },

  async getAccountRecord(whichAccount){
    let accountRecord = [];
    let  getRefOfAccountRecord = whichAccount === 'US_account' ? getUSAccountRecordRef : getAccountRecordRef;
    await getRefOfAccountRecord.once('value').then((snapshot) => {
      snapshot.forEach(element => {
        accountRecord.unshift(element.val());
      });
    });
    return accountRecord;
  },

  async tradeForAccount(transferInfo, whichAccount){
    let accountData = [];
    let transfer_price = 0;
    let date = d.dateFormat(new Date());
    let timestamp = Math.floor(Date.now() / 1000);
    let  getRefOfAccount = whichAccount === 'Taiwan_account' ? getAccountRef : getUSAccountRef;
    let  getRefOfAccountRecord = whichAccount === 'Taiwan_account' ? getAccountRecordRef : getUSAccountRecordRef;
    await getRefOfAccount.once('value').then((snapshot) => {
        accountData = snapshot.val();
    });
    if(transferInfo.transferStatus === "transferOut"){
      transfer_price = parseInt(transferInfo.price) * -1;
    }else{
      transfer_price = parseInt(transferInfo.price);
    }

    let money = (whichAccount === 'Taiwan_account' ? parseInt(accountData.accountMoney) : accountData.accountMoney) + transfer_price;
    let stock = (whichAccount === 'Taiwan_account' ? parseInt(accountData.accountStock) : accountData.accountStock);
    let summary = money + stock;
    await getRefOfAccount.update({
      accountMoney: money,
      accountStock: stock,
      summary: summary
    });

    await getRefOfAccountRecord.child(timestamp.toString()).set({
      timestamp: timestamp,
      account_record_Money: money,
      account_record_Stock: stock,
      source: transferInfo.source,
      transfer: transferInfo.price,
      transferStatus: transferInfo.transferStatus === "transferIn" ? '存入': '轉出',
      transferTime: date,
    })
    return ;

  },
  async updateAccountRecord(stockInfo, sale, route){
    let timestamp = Math.floor(Date.now() / 1000);
    let transfer_date = d.dateFormat(new Date())
    let accountData = [];
    let getRefOfAccount = (route === "US_account") ? getUSAccountRef :  getAccountRef;
    await getRefOfAccount.once('value').then((snapshot) => {
      accountData = snapshot.val();
    });
    let money = 0;
    let stock = 0;
    let cost = 0;
    let salePrice = 0;
    if(route !== "US_account") {
      cost = Math.round(stockInfo.price * 1000 * stockInfo.sheet) - Math.floor(stockInfo.price * 1000 * stockInfo.sheet * 0.001425) - Math.floor(stockInfo.price * 1000 * stockInfo.sheet * 0.003);
      salePrice = Math.floor(stockInfo.price * 1000 * stockInfo.sheet) + Math.floor(stockInfo.price * 1000 * stockInfo.sheet * 0.001425);

      if (sale) {
        money = parseInt(accountData.accountMoney) - salePrice;
        stock = parseInt(accountData.accountStock) + salePrice;
      } else {
        money = parseInt(accountData.accountMoney) + cost;
        stock = parseInt(accountData.accountStock) - stockInfo.cost;
      }
    }else{
      cost = stockInfo.price * stockInfo.sheet;
      salePrice = stockInfo.price * stockInfo.sheet;
      cost = parseFloat(cost);
      salePrice = parseFloat(salePrice);
      if (sale) {
        money = parseFloat(accountData.accountMoney) - parseFloat(salePrice);
        stock = parseFloat(accountData.accountStock) + parseFloat(salePrice);
      } else {
        money = parseFloat(accountData.accountMoney) + cost;
        stock =  parseFloat(accountData.accountStock) - stockInfo.cost;
      }
    }
    money = parseFloat(money.toFixed(2));
    stock = parseFloat(stock.toFixed(2));
    await getRefOfAccount.update({
      accountMoney: money,
      accountStock: stock,
      summary: (money + stock).toFixed(2)
    });

    let getRefOfAccountRecord =  route === "US_account" ? getUSAccountRecordRef : getAccountRecordRef;

    await getRefOfAccountRecord.child(timestamp.toString()).set({
      timestamp: timestamp,
      account_record_Money: money,
      account_record_Stock: stock,
      source: '股票',
      transfer: sale ? salePrice : cost,
      transferTime: transfer_date,
      transferStatus: sale ? '存入' : '轉出'
    });

    return ;
  },

  async getLastYearROI(items, route){
    let accountInfo  = await this.getAccount();
    let summary = parseInt(accountInfo.summary);
    let lastYearStartDate = d.dateFormat(new Date(new Date().getFullYear() - 1,0,1));
    let lastYearEndDate = d.dateFormat(new Date(new Date().getFullYear() - 1,11,31));
    let thisYearStartDate = d.dateFormat(new Date(new Date().getFullYear(),0,1));
    let thisYearEndDate = d.dateFormat(new Date(new Date().getFullYear(),11,31));
    let lastYearItems = items.filter(a => (lastYearStartDate <= a.sale_date && a.sale_date <= lastYearEndDate));
    let thisYearItems = items.filter(a => (thisYearStartDate <= a.sale_date && a.sale_date <= thisYearEndDate));
    let incomeOfLastYear = 0;
    let incomeOfThisYear = 0;
    let inAccountOfThisYear = 0;
    for (let item in lastYearItems) {
      incomeOfLastYear += lastYearItems[item].income;
    }
    for (let item in thisYearItems) {
      incomeOfThisYear += thisYearItems[item].income;
    }
    let accountRecords  = await this.getAccountRecord(route);
    let thisYearAccountRecords = accountRecords.filter(a => (thisYearStartDate <= a.transferTime && a.transferTime <= thisYearEndDate));
    for (let record in thisYearAccountRecords) {
      inAccountOfThisYear += thisYearAccountRecords[record].source !== '股票' ? parseInt(thisYearAccountRecords[record].transfer) : 0;
    }
    let ROI = (incomeOfLastYear/(summary - incomeOfThisYear - inAccountOfThisYear));
    return ROI.toFixed(4)
  }
};

export default api;