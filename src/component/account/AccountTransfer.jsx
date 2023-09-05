import React, { useState } from 'react';
import browserUtils from "../../utils/browserUtils";
import api from "../../api/api";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from 'react-redux';
import { changeContentLoading } from './../../slices/mutualState';
import { fetchAccountSummary, fetchRecords } from '../../slices/apiDataSlice';
const initialState = {
  date: new Date(),
  price: '',
  transferStatus: 'transferIn',
  source: ''
};

const AccountTransfer = (props) => {

  const [accountInfo, setAccountInfo] = useState(initialState)
  const dispatch = useDispatch();

  const inputSource = source => setAccountInfo({...accountInfo, source: source.trim()})

  const submitTrade = () => {
    const {price , transferStatus, source} = accountInfo;

    if(isNaN(price) || price.trim() === '' ){
      alert('金額欄位請輸入數字')
      return 
    }
    if (transferStatus && source && !isNaN(price)) {
      const transferInfo = {price: Number(price), transferStatus: transferStatus, source: source};
      api.tradeForAccount(transferInfo).then(() => {
        dispatch(fetchRecords());
        dispatch(fetchAccountSummary());
      });
      setAccountInfo({...accountInfo, 
        price: '',
        source: ''
      });
    } else {
      return alert('不許有任何一個為空');
    }
  };

  const getStyleOfButton = () =>{
    if(browserUtils.isMobile()){
      return {
        margin: '4px  0px'
      }
    }else{
      return {
        margin: '3px auto'
      }
    }
  };

  const handleChange = price => setAccountInfo({...accountInfo, price: price.trim()})

  const getTransferOptions = (e) => setAccountInfo({...accountInfo, transferStatus: e.target.value});

  return (
    <div style={{margin: '5px 5px'}}>
      <div className="form-row">
        <div className="col">
          <input type="text" className="form-control input-sale-info-frame" placeholder="金額"
                  onChange={(c) => handleChange(c.target.value)} value={accountInfo.price}/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder="來源"
                  onChange={(c) => inputSource(c.target.value)} value={accountInfo.source}/>
        </div>
        <div className="btn-group btn-group-toggle from-group col-md-2" data-toggle="buttons"
              style={{...getStyleOfButton()}}>
          <label className="btn btn-warning active" onClick={getTransferOptions}>
            <input type="radio" name="stockOption" id="individual" value='transferIn' autoComplete="off"/> 存入
          </label>
          <label className="btn btn-warning" onClick={getTransferOptions}>
            <input type="radio" name="stockOption" id="mutual" value='transferOut' autoComplete="off"/> 轉出
          </label>
        </div>
        <button style={{borderRadius: '5px', margin: 'auto 5px'}} className="btn btn-primary from-group col-md-2 input-sale-frame" type="submit"
                onClick={submitTrade}>確認送出
        </button>
      </div>
    </div>
  )
}

export default AccountTransfer