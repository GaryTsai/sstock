import React, { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BiSolidArrowToTop } from "react-icons/bi";
import { styled, useMediaQuery } from "@mui/material"
import { useTranslation } from 'react-i18next';

import Record from './components/record'
import AccountTransfer from './components/AccountTransfer'
import './style.css'
import { fetchRecords, fetchAccountSummary} from '../../slices/apiDataSlice';



const Account = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [accountInfo, setAccountInfo] = useState({
    isAssetTransfer: true,
  })
  const [topIconState, setTopIconState] = useState(false)
  const [dividendBtn, setDividendBtn] = useState(false)


  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { records, recordsLoading, acTime, acMoney, acStock, acSummary } = useSelector((state) => state.apiDataReducer)
  const [dividendRecords, setDividendRecords] = useState(records)

  useEffect(() => {
    !isMobile && setAccountInfo({ isAssetTransfer: true})
  }, [isMobile])


  useEffect(() => {

    dispatch(fetchRecords())
    dispatch(fetchAccountSummary())
    window.addEventListener('scroll', () => {
      if(document.documentElement.scrollTop > 0 ){
        setTopIconState(true)
      } else {
        setTopIconState(false)
      }
    })
  }, [])

  useEffect(() => {
    setDividendRecords(()=> dividendBtn ? records.filter((record)=>{
      return (/股利/).test(record.source)
    }) : records)
  }, [dividendBtn, records])
  
  const hideAssetTransfer = () => setAccountInfo({...accountInfo, isAssetTransfer: !isAssetTransfer});

  const { isAssetTransfer} = accountInfo;
  //styled-component
  const Dividend = styled('div')`
    position: relative;
    width: 100%;
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    text-align: right;
  `
  const DividendButton = () => (
    <button type="button" style={{ backgroundColor: dividendBtn ? "rgb(200, 35, 10)" : "transparent", color: dividendBtn ? "white": "black"}} 
            className="btn dividend" onClick={()=> setDividendBtn(!dividendBtn)}>
      {t('dividend')}
    </button>
  );

  return (
    <div>
      {
        topIconState && 
        <div style={{position: "absolute"}}>
          <div className="arrowToTop" onClick={() =>  window.scrollTo({top: 0, behavior: 'smooth'})}>
              <BiSolidArrowToTop />
            </div>
        </div>
      }
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <a className="nav-item nav-link tw-property active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab"
              aria-controls="nav-home" aria-selected="true">{t("twProperty")}</a>
        </div>
      </nav>
      <div className="tab-content" id="nav-tabContent">
        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
          {isMobile && !isAssetTransfer && <button className="btn btn-warning from-group col-sm-2 col-md-12 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>{t("transferProperty")}</button>}
          {isMobile && isAssetTransfer  && <button className="btn btn-secondary from-group col-sm-2 col-md-12 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>{t("hide")}</button>}
          {isAssetTransfer && <AccountTransfer/>}
          <div className="container">
            <table className="table table-striped">
              <thead>
              <tr  style={{}}> 
                <th>{t("createTime")}</th>
                <th>{t("accountMoney")}</th>
                <th>{t("stockAccount")}</th>
                <th>{t("tMoney")}</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{acTime}</td>
                <td>{acMoney}</td>
                <td>{acStock}</td>
                <td>{acSummary}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <Dividend>
              <DividendButton/>
              <span className="source-comment"> #來源需要標註<strong style={{ color: "red" }}>股利</strong> </span>
          </Dividend>
          <div>
            <div className="table-responsive" style={{ overflowX: 'unset' }}>
              <table className="table">
                <thead>
                <tr className="account-table-tr">
                  <th scope="col">#</th>
                  <th scope="col">{t("accountMoney")}</th>
                  <th scope="col">{t("stockMoney")}</th>
                  <th scope="col">{t("price")}({t("iIncome")})</th>
                  <th scope="col">{t("state")}</th>
                  <th scope="col">{t("time")}</th>
                  <th scope="col">{t("source")}</th>
                </tr>
                </thead>
                <tbody>
                {
                  !recordsLoading && dividendRecords.map((record, index) => (
                    <Record key={index} record={record} index={index}/>
                  ))
                }
                {recordsLoading && <div className="content-loading">
                    <img  alt="" className="content-loading-img"src={require('./../../assets/img/contentLoading.png')}/></div>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          {isMobile && isAssetTransfer && <button className="btn btn-warning from-group col-md-2 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>{t("transferProperty")}</button>}
          {isMobile && !isAssetTransfer  && <button className="btn btn-secondary from-group col-md-2 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>{t("hide")}</button>}
          {isAssetTransfer && <AccountTransfer/>}
          <div className="container">
            <table className="table table-striped">
              <thead>
              <tr>
                <th>{t("createTime")}</th>
                <th>{t("accountMoney")}($)</th>
                <th>{t("stockAccount")}($)</th>
                <th>{t("tMoney")}($)</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{acTime}</td>
                <td>{acMoney}</td>
                <td>{acStock}</td>
                <td>{acSummary}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
              <tr>
                <th scope="col">#</th>

                <th>{t("accountMoney")}($)</th>
                <th>{t("stockAccount")}($)</th>
                <th scope="col">{t("price")}({t("iIncome")})</th>
                <th>{t("state")}</th>
                <th>{t("time")}</th>
                <th>{t("source")}</th>
              </tr>
              </thead>
              <tbody>
              {/* {
                usRecords && usRecords.map((record, index) => (
                  <Record ket={index} record={record} index={index}/>
                ))
              } */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account