// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import "firebase/database";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import d from "../utils/dateFormat";
import settings from './../component/settings/settings'

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
// var getDataRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/stockInfo` );
// var getUSDataRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/stockInfo` );
//
// var getAccountRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_record` );
// var getAccountRecordRef = firebase.database().ref(`/accountRecord` );
// var getUSAccountRecordRef = firebase.database().ref(`/us_accountRecord` );
// var getUSAccountRef = firebase.database().ref(`/us_account` );
var stockData;

const api = {
  async getAllData() {
    let  getDataRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/stock_info` );
    await getDataRef.once('value').then(async (snapshot) => {

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
        let lastYearROI = await this.getLastYearROI(items);
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

  async insertNewData(data, route){
    let timestamp = Math.floor(Date.now() / 1000);
    let cost = Math.floor(data.price * 1000 * data.sheet * 1.001425);
    let US_cost = data.price * data.sheet;
    let  getDataRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/stock_info` );
      await getDataRef.child(timestamp.toString()).set({
      timestamp: timestamp,
      date: data.date,
      name: data.name,
      number: data.number,
      price: data.price,
      sheet: data.sheet,
      cost: route === "US_account" ?　US_cost : cost,
      income:0,
      sale_cost:0,
      sale_date:0,
      sale_price:0,
      sale_sheet:0,
      status:"unsale"
    }).then(function () {
      console.log("insert new stock successfully");
      // self.updateAllData();
    }).catch(function (err) {
      console.error("insert new stock failed：", err);
    });
  },

  async deleteStock(timestamp){
    let  getDataRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/stock_info` );
    getDataRef.child(`${timestamp}`).remove().then(function () {
      console.log("delete stock successfully");
    }).catch(function (err) {
      console.error("delete failed：", err);
    });
  },

  async updateStock(salePrice, saleSheet, stock, route){
      const isDayTrading = stock.date === d.dateFormat(new Date());
      let income = Math.round(salePrice * 1000 * saleSheet) - Math.floor(salePrice * 1000 * saleSheet * 0.001425) - Math.floor(salePrice * 1000 * saleSheet * 0.003 * (isDayTrading ? 0.5 : 1)) - stock.cost;
      let sale_cost = Math.round(salePrice * 1000 * saleSheet) - Math.floor(salePrice * 1000 * saleSheet * 0.001425) - Math.floor(salePrice * 1000 * saleSheet * 0.003 * (isDayTrading ? 0.5 : 1));
      let US_income = salePrice * saleSheet - stock.cost;
      let US_sale_cost = salePrice * saleSheet;
      let sale_date = d.dateFormat(new Date());
      let  getDataRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/stock_info` );

      await getDataRef.child(stock.timestamp).update({
        income: route === 'US_account' ? US_income : income,
        sale_cost: route === 'US_account' ? US_sale_cost : sale_cost,
        sale_date: sale_date,
        sale_price: salePrice,
        sale_sheet: saleSheet,
        status: "sale"
      });
  },

  async getAccount(){
    let accountData = [];
    let getAccountRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_summary` );
      await getAccountRef.once('value').then((snapshot) => {
        accountData = snapshot.val();
    });
    return accountData;
  },

  async getAccountRecord(){
    let accountRecord = [];
    let getAccountRef = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_record` );
    await getAccountRef.once('value').then((snapshot) => {
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
    let getRefOfAccount = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_summary` );
    let getRefOfAccountRecord = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_record` );

    await getRefOfAccount.once('value').then((snapshot) => {
        accountData = snapshot.val();
    });
    if(transferInfo.transferStatus === "transferOut"){
      transfer_price = whichAccount === 'Taiwan_account' ? parseInt(transferInfo.price) * -1 : parseFloat(transferInfo.price) * -1;
    }else{
      transfer_price = whichAccount === 'Taiwan_account' ? parseInt(transferInfo.price) : parseFloat(transferInfo.price);
    }
    let money = ((whichAccount === 'Taiwan_account' ? parseInt(accountData.accountMoney) : parseFloat(accountData.accountMoney)) + transfer_price);
    let stock = (whichAccount === 'Taiwan_account' ? parseInt(accountData.accountStock) : parseFloat(accountData.accountStock));
    let summary = money + stock;

    await getRefOfAccount.update({
      accountMoney: money.toFixed(0),
      accountStock: stock.toFixed(0),
      summary: summary.toFixed(0)
    });

    await getRefOfAccountRecord.child(timestamp.toString()).set({
      timestamp: timestamp,
      account_record_Money: money.toFixed(0),
      account_record_Stock: stock.toFixed(0),
      source: transferInfo.source,
      transfer: transferInfo.price,
      transferStatus: transferInfo.transferStatus === "transferIn" ? '存入(帳戶)': '轉出(帳戶)',
      transferTime: date,
    })
    return ;

  },
  async updateAccountRecord(stockInfo, sale, route){
    let timestamp = Math.floor(Date.now() / 1000);
    let transfer_date = d.dateFormat(new Date())
    let accountData = [];
    let getRefOfAccount = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_summary` );
    await getRefOfAccount.once('value').then((snapshot) => {
      accountData = snapshot.val();
    });
    let money = 0;
    let stock = 0;
    let cost = 0;
    let salePrice = 0;
    const isDayTrading = stockInfo.date == d.dateFormat(new Date());
    if(route !== "US_account") {
      if (sale) {
        salePrice = Math.round(stockInfo.price * 1000 * stockInfo.sheet) - Math.floor(stockInfo.price * 1000 * stockInfo.sheet * 0.001425) - Math.floor(stockInfo.price * 1000 * stockInfo.sheet * (isDayTrading ? 0.5 : 1) * 0.003);
        money = parseInt(accountData.accountMoney) + salePrice;
        stock = parseInt(accountData.accountStock) - stockInfo.cost;
      } else {
        cost = Math.round(stockInfo.price * 1000 * stockInfo.sheet) + Math.floor(stockInfo.price * 1000 * stockInfo.sheet * 0.001425);
        money = parseInt(accountData.accountMoney) - cost;
        stock = parseInt(accountData.accountStock) + cost;
      }
    }else{
      if (sale) {
        salePrice =  parseFloat(stockInfo.price) * parseFloat(stockInfo.sheet);
        cost = parseFloat(stockInfo.cost);
        money = parseFloat(accountData.accountMoney) + parseFloat(salePrice);
        stock = parseFloat(accountData.accountStock) - cost;
      } else{
        cost = parseFloat(stockInfo.price) * parseFloat(stockInfo.sheet);
        money = parseFloat(accountData.accountMoney) - cost;
        stock =  parseFloat(accountData.accountStock) + cost;
      }
    }
    money = parseFloat(money.toFixed(2));
    stock = parseFloat(stock.toFixed(2));
    await getRefOfAccount.update({
      accountMoney: money,
      accountStock: stock,
      summary: (money + stock).toFixed(2)
    });

    let getRefOfAccountRecord = firebase.database().ref(`/account_data/${settings.user_id}/${settings.country}/account_record` );
    await getRefOfAccountRecord.child(timestamp.toString()).set({
      timestamp: timestamp,
      account_record_Money: money,
      account_record_Stock: stock,
      source: '股票',
      transfer: sale ? salePrice : cost,
      transferTime: transfer_date,
      transferStatus: sale ? '轉出' : '存入'
    });

    return ;
  },

  async getLastYearROI(items){
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
    let accountRecords  = await this.getAccountRecord();
    let thisYearAccountRecords = accountRecords.filter(a => (thisYearStartDate <= a.transferTime && a.transferTime <= thisYearEndDate));
    for (let record in thisYearAccountRecords) {
      inAccountOfThisYear += thisYearAccountRecords[record].source !== '股票' ? parseInt(thisYearAccountRecords[record].transfer) : 0;
    }
    let ROI = (incomeOfLastYear/(summary - incomeOfThisYear - inAccountOfThisYear));
    return ROI.toFixed(4)
  }
};

export default api;