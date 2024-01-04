import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BiSolidArrowToTop } from "react-icons/bi";
import { styled, useMediaQuery } from "@mui/material"
import { useTranslation } from 'react-i18next';

import Records from './components/records'
import AccountTransfer from './components/AccountTransfer'
import './style.css'
import { fetchRecords, fetchAccountSummary} from '../../slices/apiDataSlice';

const Account = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [accountInfo, setAccountInfo] = useState({
    isAssetTransfer: true,
  })
  const { records, recordsLoading, acTime, acMoney, acStock, acSummary } = useSelector((state) => state.apiDataReducer)
  const [isFilter, setIsFilter] = useState(false)
  const [topIconState, setTopIconState] = useState(false)
  const [dividendBtn, setDividendBtn] = useState(false)
  // const [salaryBtn, setSalaryBtn] = useState(false)
  const [dividendRecords, setDividendRecords] = useState(records)
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    setDividendRecords(()=> dividendBtn ? records.filter((record)=> {
      return (/股利/).test(record.source)}) : records)
  }, [dividendBtn, records])

  // useEffect(() => {
  //   setDividendRecords(()=> salaryBtn ? records.filter((record)=> {
  //     return (/薪資/).test(record.source)}) : records)
  // }, [salaryBtn, records])
  
  const hideAssetTransfer = () => setAccountInfo({...accountInfo, isAssetTransfer: !isAssetTransfer});

  const { isAssetTransfer} = accountInfo;
  //styled-component
  const FilterBtnDiv = styled('div')`
    position: relative;
    width: 100%;
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    text-align: right;
  `

  const WrapperFiltereButton = ({sourceType, confiremBtn, setFunction}) => {
    const colorMap ={
      'dividend': "rgb(200, 35, 10)",
      'salary': "rgb(0,128,0)",
    }
    return (
    <button type="button" style={{ backgroundColor: confiremBtn ? colorMap[sourceType]: "transparent", color: confiremBtn ? "white": "black", border: `1px solid ${colorMap[sourceType]}`}} 
            className={`btn ${sourceType}`} onClick={()=> {
              setFunction(!confiremBtn)
              setIsFilter(confiremBtn === false ? true : false)
            }}>
      {t(`${sourceType}`)}
    </button>
  )};
 const resultRecords = isFilter ?  dividendRecords : records
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
          {isMobile && !isAssetTransfer && <button className="btn btn-warning from-group col-sm-12 col-md-12 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>{t("transferProperty")}</button>}
          {isMobile && isAssetTransfer  && <button className="btn btn-secondary from-group col-sm-12 col-md-12 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>{t("hide")}</button>}
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
          <FilterBtnDiv>
              {/* <WrapperFiltereButton sourceType={'salary'} confiremBtn={salaryBtn} setFunction={setSalaryBtn}/>
              <span className="source-comment"> #來源需要標註<strong style={{ color: "green" }}>薪資</strong> </span> */}
              <WrapperFiltereButton sourceType={'dividend'} confiremBtn={dividendBtn} setFunction={setDividendBtn}/>
              <span className="source-comment"> #來源需要標註<strong style={{ color: "red" }}>股利</strong> </span>
          </FilterBtnDiv>
          <div>
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="table text-nowrap">
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
                <Records recordsLoading={recordsLoading} records={resultRecords}/>
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