import React, { useState, useEffect} from 'react';
import Record from './record'
import AccountTransfer from './AccountTransfer'
import './account.css'
import api from '../../api/api'
import browserUtils from "../../utils/browserUtils";
import { BiSolidArrowToTop } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux';
import { changeContentLoading, changeLoading } from './../../slices/mutualState';
import { fetchRecords, fetchAccountSummary} from './../../slices/apiDataSlice';

const initialState = {
  isAssetTransfer: true
};

const Account = () => {
  const [accountInfo, setAccountInfo] = useState(initialState)
  const [topIconState, setTopIconState] = useState(false)

  const dispatch = useDispatch();
  const { contentLoading } = useSelector((state) => state.mutualStateReducer)
  const { records, recordsLoading, acTime, acMoney, acStock, acSummary } = useSelector((state) => state.apiDataReducer)
 
  useEffect(() => {
    if(records.length === 0)
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

  const hideAssetTransfer = () => setAccountInfo({...accountInfo, isAssetTransfer: !isAssetTransfer});

  const { isAssetTransfer} = accountInfo;

  return (
    <div>
      {
        topIconState && 
        <div style={{position: "absolute"}}>
          <div style={{
            position: "fixed",
            right: "25px",
            bottom: "25px",
            width: "50px",
            height: "50px",
            fontSize: "40px",
            backgroundColor: "cornflowerblue",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"}} onClick={() =>  window.scrollTo({top: 0, behavior: 'smooth'})}>
              <BiSolidArrowToTop />
            </div>
        </div>
      }
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <a className="nav-item nav-link active" style={{width: '100%', border: '0px', display: 'flex', justifyContent: 'center'}} id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab"
              aria-controls="nav-home" aria-selected="true">台股資產</a>
        </div>
      </nav>
      <div className="tab-content" id="nav-tabContent">
        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
          {browserUtils.isMobile() && !isAssetTransfer && <button className="btn btn-warning from-group col-sm-2 col-md-12 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>資產轉移</button>}
          {browserUtils.isMobile() && isAssetTransfer  && <button className="btn btn-secondary from-group col-sm-2 col-md-12 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>隱藏</button>}
          {isAssetTransfer && <AccountTransfer/>}
          <div className="container">
            <table className="table table-striped">
              <thead>
              <tr  style={{}}> 
                <th>創建時間</th>
                <th>帳戶金額</th>
                <th>股票帳戶</th>
                <th>總金額</th>
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
          <div>
            <div className="table-responsive" style={{ overflowX: 'unset' }}>
              <table className="table">
                <thead>
                <tr style={{
                  position: "sticky",
                  top: "0px",
                  backgroundColor: "black",
                  color: "#FFFFFF"
                  }}>
                  <th scope="col">#</th>
                  <th scope="col">帳戶金額</th>
                  <th scope="col">股票金額</th>
                  <th scope="col">金額(含損益)</th>
                  <th scope="col">狀態</th>
                  <th scope="col">時間</th>
                  <th scope="col">來源</th>
                </tr>
                </thead>
                <tbody>
                {
                  !recordsLoading && records.map((record, index) => (
                    <Record key={index} record={record} index={index}/>
                  ))
                }
                {recordsLoading && <div style={{position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  display: 'block',
                  zIndex: 7}}><img  alt="" style={{display:'flex',
                  width: '64px',
                  height: '64px',
                  position: 'relative',
                  margin: '0px auto',
                  backgroundSize: '100%',
                  top: 'calc(50% - 50px)'
                }} src={require('./../../assets/img/contentLoading.png')}/></div>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          {browserUtils.isMobile() && isAssetTransfer && <button className="btn btn-warning from-group col-md-2 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>資產轉移</button>}
          {browserUtils.isMobile() && !isAssetTransfer  && <button className="btn btn-secondary from-group col-md-2 input-sale-frame" type="submit" onClick={() => hideAssetTransfer()}>隱藏</button>}
          {isAssetTransfer && <AccountTransfer/>}
          <div className="container">
            <table className="table table-striped">
              <thead>
              <tr>
                <th>創建時間</th>
                <th>帳戶金額($)</th>
                <th>股票帳戶($)</th>
                <th>總金額($)</th>
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
                <th scope="col">帳戶金額</th>
                <th scope="col">股票金額</th>
                <th scope="col">金額(含損益)</th>
                <th scope="col">狀態</th>
                <th scope="col">時間</th>
                <th scope="col">來源</th>
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