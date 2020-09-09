// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import "firebase/database";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import utils from "../utils/browserUtils";
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
console.log(fireBaseConfig);
firebase.initializeApp(fireBaseConfig);
firebase.analytics();
var getDataRef = firebase.database().ref(`/stockInfo` );
var stockData;
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
    let timestamp = Math.floor(Date.now() / 1000);
    await getDataRef.child(timestamp.toString()).set({
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
    await getDataRef.update({
      income: Math.round(salePrice * 1000 * saleSheet - salePrice * 1000 * saleSheet * 0.004425 -  stock.cost),
      sale_cost: Math.round(salePrice * 1000 * saleSheet - salePrice * 1000 * saleSheet * 0.004425),
      sale_date: this.getFormatDate(new Date()),
      sale_price: salePrice,
      sale_sheet: saleSheet,
      status: "sale"
    });
  }

};

export default api;