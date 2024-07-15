import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { FormGroup, FormControlLabel, Switch,  } from '@mui/material';
import styled from '@emotion/styled'

import './style.css';
import { changeLoginStatus, changeStockMergeState } from '../../slices/mutualState';
import { fetchRealtimePrice, fetchDividendInfo } from '../../slices/apiDataSlice';
import SummaryList from './components/summaryList'
import StockComment from './components/stockComment';
import utils from "../../utils/dataHandle";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const { isMerge } = useSelector((state) => state.mutualStateReducer)
  const { historicalProfitAndLoss, totalCost, profit, profitAndLoss, lastYearROI, unSaleStocks} = useSelector((state) => state.apiDataReducer)
  const { t } = useTranslation();

  const currentStockPage = location.pathname === '/sstock' || location.pathname === '/sstock/'
  const isStockHistory = location.pathname === '/sstock/stockHistory'
  const summaryTitle = {
    [t("navBar.historicalProfitAndLoss")]: historicalProfitAndLoss + t("twDollars"),
    [t("navBar.totalCost")]: totalCost + t("twDollars"),
    [t("navBar.profitAndLoss")]: profitAndLoss + t("twDollars"),
    [t("navBar.profit")]: profit + t("percent"),
    [t("navBar.lastYearROI")]: lastYearROI + t("percent")
  };

  const logOut = async () =>{
    localStorage.removeItem('account-stock');
    dispatch(changeLoginStatus())
    navigate('/sstock/login')
  };

  const handleMerge = () => {
    dispatch(changeStockMergeState())
  }

  const summary = Object.entries(summaryTitle).map(([key, value])=>{
    return <SummaryList key={key} title={key} value={value} color={key === t("navBar.historicalProfitAndLoss") ? '#FFEB3B' : 'red'}/>
  })

  const DivCenter = styled("div")`
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    border: 3px solid;
    border-radius: 25px;
    background-color: #d5d5ef ;
    cursor: pointer;
    :hover {
      background-color: #7d7dbe ;
    }
  }`

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light navbar-background">
        <div className={`navbar-brand  ${currentStockPage ? "navbar-active stock" : "" }`} onClick={e => navigate('/sstock')}>{t("navBar.twStock")}</div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse" style={{ flexBasis: "100%" }}>
          <ul className="navbar-nav mr-auto navbar-ul">
            <li className={`nav-item ${location.pathname === '/sstock/stockHistory' ? "navbar-active" : "" }`} data-toggle="collapse" data-target=".navbar-collapse.show">
              <div className="nav-link"  onClick={e => navigate('/sstock/stockHistory')}>{t("navBar.twStockHistory")} <span className="sr-only"></span></div>
            </li>
            <li className={`nav-item ${location.pathname === '/sstock/account' ? "navbar-active" : "" }`} data-toggle="collapse" data-target=".navbar-collapse.show">
              <div className="nav-link" onClick={e => navigate('/sstock/account')}>{t("navBar.myAccount")}</div>
            </li>
            <li className={`nav-item ${location.pathname === '/sstock/chart' ? "navbar-active" : "" }`} data-toggle="collapse" data-target=".navbar-collapse.show">
              <div className="nav-link" onClick={e => navigate('/sstock/chart')}>{t("navBar.incomeChart")}</div>
            </li>
            {currentStockPage && <FormGroup sx={{whiteSpace: "nowrap"}}>
              <FormControlLabel sx={{marginBottom: 0, ".MuiFormControlLabel-label": {fontWeight: "bold"}}} control={<Switch checked={isMerge} onChange={() => handleMerge()} color="warning"/>} label={t("navBar.stockMerge")} />
            </FormGroup>}
            {currentStockPage && isMerge && <DivCenter 
            onClick={()=> {
              const stock_info = {stock_list: utils.infoMerge(unSaleStocks).map((stock) =>  { return stock.number; })}
              dispatch(fetchRealtimePrice(stock_info))
              }}><img className="realtime-update" src={require('./../../assets/img/update.png')} /></DivCenter>}
             {currentStockPage && isMerge && <DivCenter 
            onClick={()=> {
              const stock_info = {stock_list: utils.infoMerge(unSaleStocks).map((stock) =>  { return stock.number; })}
              console.log(stock_info);
              dispatch(fetchDividendInfo(stock_info))
              }}><img className="realtime-update" src={require('./../../assets/img/dividend.png')} /></DivCenter>}  
            <StockComment/>
            <li className="nav-item logout"  data-toggle="collapse" data-target=".navbar-collapse.show">
              <div className="nav-link logout-button" onClick={() => logOut()}>{t("logout")}</div>
            </li>
          </ul>
        </div>
        { currentStockPage && <div className="summary-list report background-blur">
              <SummaryList title={t("navBar.currentTotalcost")} value={totalCost + t("twDollars")}/>
            </div>}
        { isStockHistory && <div className="summary-list report" style={{display: 'inherit'}}>
              <div className="summary-history">
                {summary}
              </div>
        </div>}
      </nav>
    </div>
  )
}

export default Navbar