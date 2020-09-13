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
var getAccountRef = firebase.database().ref(`/account` );
var getAccountRecordRef = firebase.database().ref(`/accountRecord` );

var stockData;
// unique key
var timestamp = Math.floor(Date.now() / 1000);
const api = {
  async getAllData(){
    await getDataRef.once('value').then((snapshot) => {
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
        return a.sale_date < b.sale_date ? 1 : -1
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
        stockData =  {
          showStocks: items,
          allStocks: items,
          saleStocks: saleStocks,
          unSaleStocks: unSaleStocks,
          totalCost: total,
          profitAndLoss: profitAndLoss,
          saleCost: saleCost,
          profit: (profitAndLoss / saleCost * 100).toFixed(2)
        }
      }
    });
    return stockData;
  },
  async insertNewData(data){
    let cost = Math.round(data.price * 1000 * data.sheet * 1.001425);

    await getDataRef.child(timestamp.toString()).set({
      timestamp: timestamp,
      date: data.date,
      name: data.name,
      number: data.number,
      price: data.price,
      sheet: data.sheet,
      cost: cost,
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
    getDataRef.child(`${timestamp}`).remove().then(function () {
      console.log("刪除成功");
    }).catch(function (err) {
      console.error("刪除錯誤：", err);
    });
  },

  async updateStock(salePrice, saleSheet, stock){
    let income = Math.round(salePrice * 1000 * saleSheet - salePrice * 1000 * saleSheet * 0.004425 -  stock.cost);
    let sale_cost = Math.round(salePrice * 1000 * saleSheet - salePrice * 1000 * saleSheet * 0.004425);
    let sale_date = d.dateFormat(new Date())

    await getDataRef.child(stock.timestamp).update({
      income: income,
      sale_cost: sale_cost,
      sale_date: sale_date,
      sale_price: salePrice,
      sale_sheet: saleSheet,
      status: "sale"
    });
  },

  async getAccount(){
    let accountData = [];
    await getAccountRef.once('value').then((snapshot) => {
        accountData = snapshot.val();
    });
    return accountData;
  },

  async getAccountRecord(){
    let accountRecord = [];
    await getAccountRecordRef.once('value').then((snapshot) => {
      snapshot.forEach(element => {
        accountRecord.unshift(element.val());
      });
    });
    return accountRecord;
  },

  async tradeForAccount(transferInfo){
    let accountData = [];
    let transfer_price = 0;
    let date = d.dateFormat(new Date());

    await getAccountRef.once('value').then((snapshot) => {
        accountData = snapshot.val();
    });

    if(transferInfo.transferStatus === "transferOut"){
      transfer_price = parseInt(transferInfo.price) * -1;
    }else{
      transfer_price = parseInt(transferInfo.price);
    }

    let money = parseInt(accountData.accountMoney) + transfer_price;
    let stock = parseInt(accountData.accountStock);
    let summary = money + stock;

    await getAccountRef.update({
      accountMoney: money,
      accountStock: stock,
      summary: summary
    });

    await getAccountRecordRef.child(timestamp.toString()).set({
      timestamp: timestamp,
      account_record_Money: money,
      account_record_Stock: stock,
      source: transferInfo.source,
      transferIn: transferInfo.transferStatus === "transferIn" ? transferInfo.price : '',
      transferInTime: transferInfo.transferStatus === "transferIn" ? date : '',
      transferOut: transferInfo.transferStatus === "transferOut" ? transferInfo.price : '',
      transferOutTime: transferInfo.transferStatus === "transferOut" ? date : '',
    })
    return ;

  },
  async updateAccountRecord(stockInfo, sale){
    let accountData = [];

    await getAccountRef.once('value').then((snapshot) => {
      accountData = snapshot.val();
    });

    let money = 0;
    let stock = 0;
    let cost = Math.round(stockInfo.price * 1000 * stockInfo.sheet * 1.001425);
    let salePrice = Math.round(stockInfo.price * 1000 * stockInfo.sheet - stockInfo.price * 1000 * stockInfo.sheet * 0.004425);

    if(sale) {
       money = parseInt(accountData.accountMoney) - cost;
       stock = parseInt(accountData.accountStock) + cost;
    }else{
       money = parseInt(accountData.accountMoney) + salePrice;
       stock = parseInt(accountData.accountStock) - salePrice;
    }

    await getAccountRef.update({
      accountMoney: money,
      accountStock: stock,
      summary: money + stock
    });

    await getAccountRecordRef.child(timestamp.toString()).set({
      timestamp: timestamp,
      account_record_Money: money,
      account_record_Stock: stock,
      source: '股票',
      transferIn: '',
      transferInTime: '',
      transferOut: '',
      transferOutTime: '',
    });

    return ;
  }
};

export default api;