import React from 'react';
import browserUtils from '../../utils/browserUtils';
import styles from './style';
import { FormGroup, FormControlLabel, Switch } from '@mui/material'
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { changeLoginStatus, changeStockMergeState } from './../../slices/mutualState';
import SummaryList from './summaryList'
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const { isMerge } = useSelector((state) => state.mutualStateReducer)
  const { totalCost, saleCost, profit, profitAndLoss, lastYearROI} = useSelector((state) => state.apiDataReducer)
  const { t } = useTranslation();

  const currentStockPage = location.pathname === '/sstock' || location.pathname === '/sstock/'
  const isStockHistory = location.pathname === '/stockHistory'
  const summaryTitle = {
    [t("navBar.totalCost")]: totalCost + t("twDollars"),
    [t("navBar.profitAndLoss")]: profitAndLoss + t("twDollars"),
    [t("navBar.profit")]: profit + t("percent"),
    [t("navBar.lastYearROI")]: lastYearROI + t("percent")
  };
  const getActiveStyle = () =>{
    if(browserUtils.isMobile()){
      return {
        fontSize: '16px',
        marginLeft: '5px',
        background:'rgb(232 232 232)',
        borderRadius: '10px',
        whiteSpace: "nowrap"
      }
    } else {
      return {
        fontSize: '16px',
        cursor: 'pointer',
        background: 'rgb(232 232 232)',
        borderRadius: '10px',
        whiteSpace: "nowrap"
      }
    }
  };

  const getComputeStyleForMobile = () =>{

    if(browserUtils.isMobile()){
      return {
        flexBasis: "100%",
        flexGrow: '1',
        alignItems: 'center',
        color:'#ed2a2a',
        fontSize:'16px',
        fontWeight:'bold',
        whiteSpace: 'nowrap'
      }
    }else{
      return {
        flexBasis: 'auto',
        color:'#ed2a2a',
        fontSize:'18px',
        fontWeight:'bold',
        whiteSpace: 'nowrap'
      }
    }
  };

  const logOut = async () =>{
    localStorage.removeItem('account-stock');
    dispatch(changeLoginStatus())
    navigate('/login')
  };

  const handleMerge = () => {
    dispatch(changeStockMergeState())
  }

  const isMobile = browserUtils.isMobile();
  const summary = Object.entries(summaryTitle).map(([key, value])=>{
    return <SummaryList key={key} title={key} value={value}/>
  })

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light " style={{backgroundColor: 'rgb(52 149 220)'}}>
        <div className="navbar-brand"  style={currentStockPage ? {...getActiveStyle(), padding: '5px'} : {cursor: 'pointer'}} onClick={e => navigate('/sstock')}>{t("navBar.twStock")}</div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse" style={{ flexBasis: "100%" }}>
          <ul className="navbar-nav mr-auto" style={{alignItems: isMobile ? "unset" : "center"}}>
            <li className={`nav-item`} data-toggle="collapse" data-target=".navbar-collapse.show" style={location.pathname === '/sstock/stockHistory' ? getActiveStyle() : {whiteSpace: "nowrap", width: '-webkit-fill-available', cursor: 'pointer'}}>
              <div className="nav-link"  onClick={e => navigate('/sstock/stockHistory')}>{t("navBar.twStockHistory")} <span className="sr-only"></span></div>
            </li>
            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show" style={location.pathname === '/sstock/account' ? getActiveStyle() : {whiteSpace: "nowrap", width: '-webkit-fill-available', cursor: 'pointer'}} >
              <div className="nav-link" onClick={e => navigate('/sstock/account')} >{t("navBar.myAccount")}</div>
            </li>
            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show" style={location.pathname === '/sstock/chart' ? getActiveStyle() : {whiteSpace: "nowrap", width: '-webkit-fill-available', cursor: 'pointer'}} >
              <div className="nav-link" onClick={e => navigate('/sstock/chart')} >{t("navBar.incomeChart")}</div>
            </li>
            {currentStockPage && <FormGroup sx={{whiteSpace: "nowrap", width: '-webkit-fill-available'}}>
              <FormControlLabel sx={{marginBottom: 0}}control={<Switch checked={isMerge} onChange={() => handleMerge()} color="warning"/>} label={t("navBar.stockMerge")} />
            </FormGroup>}
            {isMobile &&<li className="nav-item"  data-toggle="collapse" data-target=".navbar-collapse.show" style={{marginTop: isMobile ? "5px": "0px", marginLeft: '5px', position: isMobile ? "unset": "absolute" , right: isMobile ? "unset" : "5px"}}>
              <div className="nav-link" style={styles.logOutButtonMobile} onClick={() => logOut()} >{t("logout")}</div>
            </li>}
          </ul>
        </div>
        { currentStockPage && <div style={{ padding: '5px 0px',...getComputeStyleForMobile()}}>
              <SummaryList title={t("navBar.currentTotalcost")} value={totalCost + t("twDollars")}/>
            </div>}
        { isStockHistory && <div style={{display: 'inherit',...getComputeStyleForMobile()}}>
              <div style={isMobile ? styles.reportMobile : styles.report}>
                {summary}
              </div>
        </div>}
        {!isMobile && <div style={styles.logOutButton} onClick={() => logOut()}>{t("logout")}</div>}
      </nav>
    </div>
  )
}

export default Navbar