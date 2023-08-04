import React, {Component} from 'react';
import browserUtils from '../../utils/browserUtils';
import styles from './style';
import {FormGroup, FormControlLabel, Switch} from '@mui/material'
const Navbar = (props) => {

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
        whiteSpace: "nowrap",
        cursor: 'pointer'
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

  const isDispalyBenefitInfo = () =>{
    const {saleCost, profitAndLoss, profit, lastYearROI} = props;
    const info = [saleCost, profitAndLoss, profit, lastYearROI]

  };

  const {saleCost, profitAndLoss, profit, totalCost ,route, changeRoute, logOutCallBack, lastYearROI, isMerge} = props;
  const isMobile = browserUtils.isMobile();

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light " style={{backgroundColor: 'rgb(52 149 220)'}}>
        <div className="navbar-brand"  style={route === 'accountInfo' ? {...getActiveStyle(), padding: '5px'} : {cursor: 'pointer'}} onClick={e => changeRoute('accountInfo')}>台灣股票</div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse" style={{ flexBasis: "100%" }}>
          <ul className="navbar-nav mr-auto" style={{alignItems: isMobile ? "unset" : "center"}}>
            <li className={`nav-item`} data-toggle="collapse" data-target=".navbar-collapse.show" style={route === 'stockHistory' ? getActiveStyle() : {whiteSpace: "nowrap", width: '-webkit-fill-available', cursor: 'pointer'}}>
              <div className="nav-link"  onClick={e => changeRoute('stockHistory')}>台股歷史紀錄 <span className="sr-only"></span></div>
            </li>
            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show" style={route === 'account' ? getActiveStyle() : {whiteSpace: "nowrap", width: '-webkit-fill-available', cursor: 'pointer'}} >
              <div className="nav-link" onClick={e => changeRoute('account')} >我的帳戶</div>
            </li>
            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show" style={route === 'balanceChart' ? getActiveStyle() : {whiteSpace: "nowrap", width: '-webkit-fill-available', cursor: 'pointer'}} >
              <div className="nav-link" onClick={e => changeRoute('balanceChart')} >損益圖表</div>
            </li>
            {route === 'accountInfo' && <FormGroup sx={{whiteSpace: "nowrap", width: '-webkit-fill-available'}}>
              <FormControlLabel sx={{marginBottom: 0}}control={<Switch checked={isMerge} onChange={() => props.handleMerge()} color="warning"/>} label="股票統整" />
            </FormGroup>}
            {isMobile &&<li className="nav-item"  data-toggle="collapse" data-target=".navbar-collapse.show" style={{marginTop: isMobile ? "5px": "0px", marginLeft: '5px', position: isMobile ? "unset": "absolute" , right: isMobile ? "unset" : "5px"}}>
              <div className="nav-link" style={styles.logOutButtonMobile} onClick={() => logOutCallBack()} >登出</div>
            </li>}
          </ul>
        </div>
        {(route === 'accountInfo') && <div style={{ padding: '5px 0px',...getComputeStyleForMobile()}}>
              <div style={isMobile ? styles.reportFormatMobile : styles.reportFormat}><div>目前投入總成本:</div><div> {totalCost}元</div></div>
            </div>}
        {(route === 'stockHistory') && <div style={{display: 'inherit',...getComputeStyleForMobile()}}>
              <div style={isMobile ? styles.reportMobile : styles.report}>
              <div style={isMobile ? styles.reportFormatMobile : styles.reportFormat}><div>投入成本:</div><div>{saleCost}元</div></div>
              <div style={isMobile ? styles.reportFormatMobile : styles.reportFormat}><div>總損益:</div> <div>{profitAndLoss}元</div></div>
              <div style={isMobile ? styles.reportFormatMobile : styles.reportFormat}><div>投報率:</div> <div>{profit}%</div></div>
              <div style={isMobile ? styles.reportFormatMobile : styles.reportFormat}><div>去年投報率:</div> <div>{lastYearROI}%</div></div>
              </div>
        </div>}
        {!isMobile && <div style={styles.logOutButton} onClick={() => logOutCallBack()}>登出</div>}
      </nav>
    </div>
  )
}

export default Navbar