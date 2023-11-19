import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2'

import api from "../../../api/api";
import { fetchAccountSummary, fetchRecords } from '../../../slices/apiDataSlice';
import './../style.css'

const initialState = {
  date: new Date(),
  price: '',
  transferStatus: 'transferIn',
  source: ''
};

const AccountTransfer = (props) => {

  const [accountInfo, setAccountInfo] = useState(initialState)
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const inputSource = source => setAccountInfo({...accountInfo, source: source.trim()})

  const submitTrade = () => {
    const {price , transferStatus, source} = accountInfo;

    if(isNaN(price) || price.trim() === '' ){
      Swal.fire({
        icon: 'warning',
        title: t("alertWarning"),
        text: t("fieldInputWarning_Price"),
      })
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
      return Swal.fire({
        icon: 'warning',
        title: t("alertWarning"),
        text: t("inputRegion.fieldsEmpty"),
      })
    }
  };

  const handleChange = price => setAccountInfo({...accountInfo, price: price.trim()})

  const getTransferOptions = (e) => setAccountInfo({...accountInfo, transferStatus: e.target.value});

  return (
    <div className="account-transfer-frame">
      <div className="form-row">
        <div className="col">
          <input type="text" className="form-control input-sale-info-frame" placeholder={t("price")} onChange={(c) => handleChange(c.target.value)} value={accountInfo.price}/>
        </div>
        <div className="from-group col-md-2 input-sale-info-frame">
          <input type="text" className="form-control" placeholder={t("source")} onChange={(c) => inputSource(c.target.value)} value={accountInfo.source}/>
        </div>
        <div className="btn-group btn-group-toggle from-group col-md-2 account-input-frame" data-toggle="buttons" >
          <label className="btn btn-warning active" onClick={getTransferOptions}>
            <input type="radio" name="stockOption" id="individual" value='transferIn' autoComplete="off"/> {t("deposit")}
          </label>
          <label className="btn btn-warning" onClick={getTransferOptions}>
            <input type="radio" name="stockOption" id="mutual" value='transferOut' autoComplete="off"/> {t("transfer")}
          </label>
        </div>
        <button className="btn btn-primary from-group col-md-2 input-sale-frame account-confirm" type="submit" onClick={submitTrade}>{t("confirm")}
        </button>
      </div>
    </div>
  )
}

export default AccountTransfer