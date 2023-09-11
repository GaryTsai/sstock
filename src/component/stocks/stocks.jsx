import React, { useEffect } from "react";
import Stock from "./stock";
import InputRegion from "../inputRegion";
import Input from "../input";
import browserUtils from "../../utils/browserUtils";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { fetchStock, fetchAccountSummary } from "../../slices/apiDataSlice";
import { changeInitLoading } from "../../slices/mutualState";
import settings from "../settings/settings";

const Stocks = () => {
  const { queryStatus, isMerge } = useSelector(
    (state) => state.mutualStateReducer
  );
  const { allStocks, unSaleStocks, showStocks, loading } = useSelector(
    (state) => state.apiDataReducer
  );

  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = browserUtils.isMobile();
  const isStockHistory = location.pathname === "/stockHistory";

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
        let handingFee = prev.price * 1000 * prev.sheet * 0.001425 < 20 ? 20 : Math.floor(prev.price * 1000 * prev.sheet * 0.001425);
        if(prev.number === '00878')
          console.log(handingFee)
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
      console.log(mergeResult)
      return mergeResult;
    }, []);

    return result;
  };

  const stocks = isStockHistory ? queryStatus === "all" ? allStocks : showStocks : isMerge ? infoMerge(unSaleStocks) : unSaleStocks;
  
  if (stocks === "No Data" || stocks.length !== 0) {
    if(settings.isFirst){
      dispatch(changeInitLoading(false));
      settings.isFirst = false
    }
  }

  return (
    <div>
      <Input />
      {<InputRegion />}
      <div style={{ overflowY: isMobile ? "scroll" : "unset" }}>
        <table className="table table-dark" style={{ whiteSpace: "nowrap" }}>
          <thead>
            <tr
              style={{
                position: "sticky",
                top: "0px",
                backgroundColor: "black",
              }}
            >
              <th scope="col">#</th>
              {!isStockHistory && isMerge === false && (
                <th scope="col">賣出</th>
              )}
              {!isStockHistory && isMerge === false && (
                <th scope="col">購買日期</th>
              )}
              {isStockHistory && <th scope="col">購買日期</th>}
              {isStockHistory && <th scope="col">賣出日期</th>}
              <th scope="col">股票名稱</th>
              <th scope="col">編號</th>
              <th scope="col">平均單價</th>
              <th scope="col">張數</th>
              <th scope="col">手續費</th>
              <th scope="col">購買成本</th>
              <th scope="col">狀態</th>
              <th scope="col">賣出總價</th>
              <th scope="col">損益</th>
              {!isStockHistory && <th scope="col">刪除</th>}
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
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  display: "block",
                  zIndex: 7,
                }}
              >
                <img
                  alt=""
                  style={{
                    display: "flex",
                    width: "64px",
                    height: "64px",
                    position: "relative",
                    margin: "0px auto",
                    backgroundSize: "100%",
                    top: "calc(50% - 50px)",
                  }}
                  src={require("./../../assets/img/contentLoading.png")}
                />
              </div>
            )}
            {stocks === "No Data" && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  height: "50%",
                  width: "100%",
                  display: "block",
                  zIndex: 7,
                }}
              >
                <div
                  alt=""
                  style={{
                    position: "relative",
                    margin: "0px auto",
                    color: "black",
                    fontSize: 32,
                  }}
                >
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
