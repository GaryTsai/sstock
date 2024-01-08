import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import Stock from "./stock";
import InputRegion from "./components/inputRegion";
import Input from "./components/input";
import { fetchStock, fetchAccountSummary } from "../../slices/apiDataSlice";
import { changeInitLoading } from "../../slices/mutualState";
import settings from "../../settings";
import './style.css'

const { HANDLING_CHARGE_RATE, MINIMUM_HANDLING_FEE } = settings

const Stocks = () => {
  const { queryStatus, isMerge } = useSelector(
    (state) => state.mutualStateReducer
  );
  const { allStocks, unSaleStocks, showStocks, loading } = useSelector(
    (state) => state.apiDataReducer
  );

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

  const infoMerge = (datas) => {
    const result = datas.reduce((mergeResult, prev, next) => {
      const isNotExist =
        mergeResult && mergeResult.filter((item) => _.trim(item.number) === _.trim(prev.number)).length === 0;
        let handingFee = prev.price * 1000 * prev.sheet * HANDLING_CHARGE_RATE < MINIMUM_HANDLING_FEE ? MINIMUM_HANDLING_FEE : Math.round(prev.price * 1000 * prev.sheet * HANDLING_CHARGE_RATE);

      if (isNotExist) {
        mergeResult.push({
          cost: prev.cost,
          income: 0,
          name: prev.name,
          number: prev.number,
          price: prev.price * prev.sheet,
          sale_cost: 0,
          sale_date: 0,
          sale_price: 0,
          sale_sheet: 0,
          sheet: prev.sheet,
          status: "unsale",
          handingFee: handingFee
        });
      } else {
        const index = _.findIndex(
          mergeResult,
          (e) => _.trim(e.number) === _.trim(prev.number),
          0
        );
        mergeResult[index] = {
          ...mergeResult[index],
          cost: mergeResult[index].cost + prev.cost,
          price: mergeResult[index].price + prev.price * prev.sheet,
          sheet: mergeResult[index].sheet + prev.sheet,
          handingFee: mergeResult[index].handingFee +  handingFee
        };
      }

      return mergeResult;
    }, []);

    return result;
  };

  const stocks = isStockHistory ? queryStatus === "all" ? allStocks : showStocks : isMerge ? infoMerge(unSaleStocks) : unSaleStocks;
  
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
              stocks.map((stock, index) => (
                <Stock
                  key={stock.number + index}
                  stock={stock}
                  index={index + 1}
                  isMerge={isMerge}
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
