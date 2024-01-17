import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Stock from "./stock";
import InputRegion from "./components/inputRegion";
import Input from "./components/input";
import { fetchStock, fetchAccountSummary } from "../../slices/apiDataSlice";
import { changeInitLoading } from "../../slices/mutualState";
import settings from "../../settings";
import './style.css'
import utils from "../../utils/dataHandle";

const { BREAK_EVEN_RATE } = settings

const Stocks = () => {
  const { queryStatus, isMerge } = useSelector(
    (state) => state.mutualStateReducer
  );
  const { allStocks, unSaleStocks, showStocks, loading, stockRealtimePrice, stockRealtimePriceStatus, stockRealtimePriceOffset} = useSelector(
    (state) => state.apiDataReducer
  );
  const [incomeSort, setIncomeSort] = useState({sort: null })
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const isStockHistory = location.pathname === "/sstock/stockHistory";

  useEffect(() => {
    if(settings.isFirst){
      dispatch(changeInitLoading(true));
    }
    dispatch(fetchAccountSummary())
    dispatch(fetchStock());
  }, []);

  const stocks = isStockHistory ? queryStatus === "all" ? allStocks : showStocks : isMerge ? utils.infoMerge(unSaleStocks) : unSaleStocks;
  const sortStocks = (stocks) => {
    if(stockRealtimePrice !== null && incomeSort.sort !== null && isMerge === true){
      Object.entries(stocks).map((stock)=>{
        const breakEvenPrice = parseFloat((stock[1].price * (1 + BREAK_EVEN_RATE)).toFixed(2));
        stock[1]['currentIncome'] = parseFloat((stockRealtimePrice[stock[1].number] - (breakEvenPrice / (stock[1].sheet))).toFixed(2)) * 1000 * stock[1].sheet 
      })
      function compare( a, b ) {
        if(incomeSort.sort === true){
          if ( a.currentIncome > b.currentIncome ){
            return -1;
          }
          if ( a.currentIncome < b.currentIncome ){
            return 1;
          }
          return 0;
        } else {
          if ( a.currentIncome < b.currentIncome ){
            return -1;
          }
          if ( a.currentIncome > b.currentIncome ){
            return 1;
          }
          return 0;
        }
      }
      stocks.sort( compare );
    }
    return stocks
  }
  if (stocks === "No Data" || stocks.length === 0) {
    if(settings.isFirst){
      dispatch(changeInitLoading(false));
      settings.isFirst = false
    }
  } else {
    dispatch(changeInitLoading(false));
  }

  return (
    <div>
      <Input />
      {<InputRegion />}
      <div style={{ overflowY: "unset", overflowX: "auto" }}>
        <table className="table table-dark" style={{ whiteSpace: "nowrap" }}>
          <thead>
            <tr className="sticky-tr">
              <th scope="col">#</th>
              {!isStockHistory && isMerge === false && (
                <th scope="col">{t("sell")}</th>
              )}
              {!isStockHistory && isMerge === false && (
                <th scope="col">{t("input.buyDate")}</th>
              )}
              {isStockHistory && <th scope="col">{t("input.buyDate")}</th>}
              {isStockHistory && <th scope="col">{t("input.sellDate")}</th>}
              <th scope="col">{t("input.stockName")}</th>
              <th scope="col">{t("input.stockNumber")}</th>
              <th scope="col">{t("input.avgPrice")}</th>
              {!isStockHistory && isMerge === true && (
                <th scope="col">{t("input.breakevenPrice")}</th>
              )}
              {!isStockHistory && isMerge === true && (
                <th scope="col">{t("input.realtimePrice")}</th>
              )}
              {!isStockHistory && isMerge === true && (
                <th scope="col">{t("input.currentOffset")}</th>
              )}
              {!isStockHistory && isMerge === true && (
                <th scope="col" style={{cursor: 'pointer'}} onClick={() => {
                  if(stockRealtimePrice !== null && loading !== true) 
                    setIncomeSort({sort: !incomeSort.sort})}}>{t("input.currentIncome")}{incomeSort.sort === null ? '' : incomeSort.sort ===  true ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}</th>
              )}
              <th scope="col">{t("input.stockSheet")}</th>
              <th scope="col">{t("input.handingFee")}</th>
              <th scope="col">{t("input.cost")}</th>
              <th scope="col">{t("state")}</th>
              {isStockHistory && <th scope="col">{t("input.salePrice")}</th>}
              {isStockHistory && <th scope="col">{t("input.sellTotalPrice")}</th>}
              {isStockHistory && <th scope="col">{t("input.income")}</th>}
              {!isStockHistory && !isMerge && <th scope="col">{t("delete")}</th>}
            </tr>
          </thead>
          <tbody>
            {!loading &&
              stocks !== "No Data" &&
              stocks.length !== 0 &&
              sortStocks(stocks).map((stock, index) => (
                <Stock
                  key={stock.number + index}
                  stock={stock}
                  index={index + 1}
                  isMerge={isMerge}
                  stockRealtimePrice={stockRealtimePrice}
                  stockRealtimePriceStatus={stockRealtimePriceStatus}
                  stockRealtimePriceOffset={stockRealtimePriceOffset}
                />
              ))}
            {!settings.isFirst && loading && (
              <div className="content-loading">
                <img alt="" className="content-loading-img" src={require("./../../assets/img/contentLoading.png")} />
              </div>
            )}
            {stocks === "No Data" && (
              <div className="stock-noData">
                <div className="stock-noData-content" alt="">
                  No Data
                </div>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stocks;
