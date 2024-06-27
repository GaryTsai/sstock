import React, { useState, useEffect, useRef} from 'react';
import { useLocation } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useMediaQuery } from '@mui/material';
import Swal from 'sweetalert2'

import { updateQueryData } from '../../../slices/apiDataSlice';
import { changeQueryStatus } from '../../../slices/mutualState';
import utils from "../../../utils/dateFormat";
import "./../../styles.css";

const InputRegion = () => {
  const { queryStatus } = useSelector((state) => state.mutualStateReducer);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [inputInfo, setInputInfo] = useState({
    startStandardDate: '',
    endStandardDate: '',
    dateRegion1: '',
    dateRegion2: '',
    saleStatus: 'all',
    stockStatus: 'individual',
    queryState: '',
    isQueryOpen: isMobile ? false : true,
  })

  const timeRegionInputRef = useRef({})
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation();

  useEffect(() => {
    if(queryStatus === 'all')
      dispatch(updateQueryData({
          dateRegion1: utils.dateFormat(new Date(1950, 0, 1)),
          dateRegion2: utils.dateFormat(new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())),
          saleStatus: 'all',
          stockStatus:'individual'}))
  }, [queryStatus])

  useEffect(() => {
    !isMobile && setInputInfo({...inputInfo, isQueryOpen: true})
  }, [isMobile])

  useEffect(() => {
    setInputInfo({...inputInfo, 
      date: utils.dateFormat(new Date()),
      dateRegion1: utils.dateFormat(new Date()),
      dateRegion2: utils.dateFormat(new Date()), 
      startStandardDate: utils.dateFormat(new Date()), 
      endStandardDate: utils.dateFormat(new Date())})
  }, [])

  const queryRegion = (region = '') => {
    const {dateRegion1, dateRegion2, saleStatus, stockStatus } = inputInfo;
    let stockInfo = {};
    let startDate = new Date();
    let endDate = new Date();
    dispatch(changeQueryStatus('query'))
    if (region) {
      if (region === 'yearAgo') {
        const yearAgo = new Date().getFullYear() - 1
        stockInfo = {
          dateRegion1: utils.dateFormat(new Date(yearAgo, 0, 1)),
          dateRegion2: utils.dateFormat(new Date(yearAgo, 11, 31)),
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
      } else if (region === 'thisYear') {
        const yearAgo = new Date().getFullYear()
        stockInfo = {
          dateRegion1: utils.dateFormat(new Date(yearAgo, 0, 1)),
          dateRegion2: utils.dateFormat(new Date(yearAgo, 11, 31)),
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
      } else {
        startDate.setDate(startDate.getDate() - region);
        endDate.setDate(endDate.getDate() + 1);
        stockInfo = {
          dateRegion1: utils.dateFormat(startDate),
          dateRegion2: utils.dateFormat(endDate),
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
      }
      return dispatch(updateQueryData(stockInfo));
    } else {
      if (dateRegion1 && dateRegion2 && saleStatus && stockStatus) {
        stockInfo = {
          dateRegion1: dateRegion1,
          dateRegion2: dateRegion2,
          saleStatus: saleStatus,
          stockStatus: stockStatus
        };
        dispatch(updateQueryData(stockInfo));
        setInputInfo({...inputInfo,
          date: '',
          name: '',
          number: '',
          price: '',
          sheet: ''
        })
      } else {
        return Swal.fire({
          icon: 'warning',
          title: t('alertWarning!'),
          text: t('InputRegion.fieldsEmpty')
        })
      }
    }
  };

  const inActiveTimeRegionGroup = () =>{
    Object.keys(timeRegionInputRef.current).map((option, index)=>{
      timeRegionInputRef.current[option].classList.remove('active')
      return {}
    });   
  }

  const handleDateChange = (date, dateState) => {
    inActiveTimeRegionGroup()

    if(dateState === 'start'){
      if(date > inputInfo.endStandardDate){
        Swal.fire({
          icon: 'warning',
          title: t('alertWarning'),
          text: t('inputRegion.startIsGreaterThanEnd')
        })
        return
      }
      setInputInfo({...inputInfo, startStandardDate:date, dateRegion1: date, queryState: ''});
    }
    else{
      if(date < inputInfo.startStandardDate){
        Swal.fire({
          icon: 'warning',
          title: t('alertWarning'),
          text: t('inputRegion.endIsLessThanStart')
        })
        return
      }
      setInputInfo({...inputInfo, endStandardDate:date, dateRegion2: date, queryState: ''});
    }
  }

  const getSaleOptions = (e) => setInputInfo({...inputInfo, saleStatus: e.target.value});

  const getStyleOfButton = () =>{
    if(isMobile) {
      return {
        margin: '5px 0px',
        paddingRight: '0px',
        paddingLeft: '0px',
        whiteSpace: 'nowrap'
        
      }
    }else{
      return {
        margin: '3px 0px',
        padding: '0px',
        whiteSpace: 'nowrap'
      }
    }
  };

  const setQueryOpen = status => setInputInfo({ ...inputInfo ,isQueryOpen:status });

  const { startStandardDate, endStandardDate, isQueryOpen } = inputInfo;
  const isStockHistory = location.pathname === '/sstock/stockHistory';

  return (
    <>
      {isStockHistory && !isQueryOpen && <button style={{borderRadius: '0px'}} className="btn btn-success from-group col-sm-12 col-md-12 mobile-show" type="submit" onClick={() => setQueryOpen(true)}>{t('inputRegion.queryTimePeriod')}</button>}
      {isStockHistory && isQueryOpen && <button style={{borderRadius: '0px'}} className="btn btn-secondary from-group col-sm-12 col-md-12 mobile-show" type="submit" onClick={() => setQueryOpen(false)}>{t('hide')}</button>}
    {isStockHistory && isQueryOpen && <div>
        <div className="form-row" style={{margin:'0 5px', overflowY: 'unset', whiteSpace: 'nowrap'}}>
          <button type="button" className={"btn btn-info from-group col-md-1" + (isMobile ? ' show-all-stock-mobile' : ' show-all-stock')}  onClick={()=> {
            dispatch(changeQueryStatus('all'))
            inActiveTimeRegionGroup()
            }}>{t('inputRegion.allStock')}</button>
          <button type="button"  className={"btn btn-group btn-group-toggle" + (isMobile ? ' from-group col-md-6' : ' from-group' +' col-md-2')} data-toggle="buttons" style={{margin: '0px 10px', zIndex: 0, ...getStyleOfButton()}}>
            <label className="btn btn-secondary active" onClick={getSaleOptions}>
              <input type="radio" name="saleOption" id="saleOption1" value='all' autoComplete="off" /> {t('inputRegion.all')}
            </label>
            <label className="btn btn-secondary" onClick={getSaleOptions}>
              <input type="radio" name="saleOption" id="saleOption2" value='sale' autoComplete="off" /> {t('inputRegion.sale')}
            </label>
            <label className="btn btn-secondary" onClick={getSaleOptions}>
              <input type="radio" name="saleOption" id="saleOption3" value='unsale'  autoComplete="off" /> {t('inputRegion.unsale')}
            </label>
          </button>
          <div className={"btn-group btn-group-toggle col-sm-12 col-md-3" + (isMobile ? " query-region-group-mobile": " query-region-group")} data-toggle="buttons">
            <label className="btn btn-outline-success" ref={el => timeRegionInputRef.current['option1'] = el}>
              <input type="radio" name="options" id="option1" onClick={()=> setInputInfo({...inputInfo, queryState: 0})} /> {t('inputRegion.today')}
            </label>
            <label className="btn btn-outline-success" ref={el => timeRegionInputRef.current['option2'] = el}>
              <input type="radio" name="options" id="option2" onClick={()=> setInputInfo({...inputInfo, queryState: 7})}/> {t('inputRegion.prev7')}
            </label>
            <label className="btn btn-outline-success" ref={el => timeRegionInputRef.current['option3'] = el}>
              <input type="radio" name="options" id="option3" onClick={()=> setInputInfo({...inputInfo, queryState: 120})} /> {t('inputRegion.prevThreeMonth')}
            </label>
            <label className="btn btn-outline-success" ref={el => timeRegionInputRef.current['option4'] = el}>
            <input type="radio" name="options" id="option4" onClick={()=> setInputInfo({...inputInfo, queryState: 'yearAgo'})}/> {t('inputRegion.lastYear')}
            </label>
            <label className="btn btn-outline-success" ref={el => timeRegionInputRef.current['option5'] = el}>
            <input type="radio" name="options" id="option5" onClick={()=> setInputInfo({...inputInfo, queryState: 'thisYear'})}/> {t('inputRegion.thisYear')}
            </label>
          </div>
          <div className="col-sm-6 col-md-2 col-xs-12 query-time-fields">
              <div>{t('inputRegion.start')}</div>
              <div className="col">
                <input type="date" className="form-control" placeholder={t('inputRegion.date')} onChange={(c) => handleDateChange(c.target.value, 'start')} value={startStandardDate}/>
              </div>
          </div>
          <div  className="col-sm-6 col-md-2 col-xs-12 query-time-fields">
              <div>{t('inputRegion.end')}</div>
              <div className="col">
                <input type="date" className="form-control" placeholder={t('inputRegion.date')} onChange={(c) => handleDateChange(c.target.value, 'end')} value={endStandardDate}/>
              </div>
          </div>

          <button className={"btn btn-primary "+ (isMobile ? ' from-group col-md-2' : ' from-group col-md-2' +
            ' query-region-submit') } style={{...getStyleOfButton()}} onClick={()=> queryRegion(inputInfo.queryState)}>{t('inputRegion.querySubmit')}</button>
        </div>
    </div>}
    </>
  )
}


export default InputRegion