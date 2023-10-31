import React, { useEffect, useState, useTransition } from 'react'
import Grid from '@mui/material/Grid';
import YearColumnChart from '../../custom/YearColumnChart';
import DualColumnChart from '../../custom/DulaColumnChart';
import DividendChart from '../../custom/YearDividendChart';
import Report from '../../custom/Report';
import api from '../../api/api'
import { useSelector, useDispatch} from 'react-redux';
import { fetchStock } from '../../slices/apiDataSlice';
import { useTranslation } from 'react-i18next';

const TwChart = () => {
  
  const [dividendInfo, setDividendInfo] = useState({
    yearDividend: {},
    perDividend: [],
    chartInfo: {
      categories: [],
      monthValue: [],
      monthRate: [],
      yearCategories: [],
      yearValue: []
    }
  })
  const [chartTab, setChartTab] = useState("monthIncome")
  const { allStocks } = useSelector((state) => state.apiDataReducer)
  const dispatch = useDispatch()
  const { t } = useTranslation();

  const getDate = data => {
    const firstDateYear = data[data.length-1].date.substring(0 ,4)
    const firstDateMonth = data[data.length-1].date.substring(5 ,7)
    const lastDateYear = new Date().getFullYear().toString()
    const lastDateMonth = (new Date().getMonth() + 1).toString()
    let dateArray = []
    for(let year = firstDateYear; year <= lastDateYear; year++ ){
      for(let month = (year === firstDateYear ? firstDateMonth : 1 ); month <= (year === lastDateYear ? lastDateMonth : 12 ); month++ ){
        if(month.toString().length <=1 && month !== 0)
          dateArray.push(`${year}-0${month}`)
        else
          dateArray.push(`${year}-${month}`)
      }
    }
    if(dateArray > 12)
      dateArray = dateArray.slice(11);

    return dateArray
  }

  const getYearValue = (categories, data) =>{
    let valueArray = []
    categories.map((year)=>{
      let balance = 0
      data.forEach(it => {
        if(it.sale_date.substr(0, 4) === year){
          balance += it.income
        }
      })
      valueArray.push({y: balance, color: balance > 0 ? "#32a852" : "#ff0000"})
      return {}
    })
    return valueArray
  }

  const getYearDate = data => {
    const firstDateYear = data[data.length-1].date.substring(0 ,4)
    const lastDateYear = new Date().getFullYear()
    let yearArray = []
    for(let year = firstDateYear; year <= lastDateYear; year++ ){
      yearArray.push(`${year}`)
    }
    return yearArray
  }

  const getValue = (categories, data) =>{
    let valueArray = []
    let ROIArray = []
    let ROI = 0
    categories.map((date)=>{
      let balance = 0
      let costSummary = 0
      data.forEach(it => {
        if(it.sale_date === date){
          balance += it.income
          costSummary += it.cost 
        }
      })
      if(balance === 0 || costSummary === 0) ROI = 0
      else{
        ROI = Math.round((balance/costSummary) * 100)
      }
      valueArray.push({y: balance, date: date, color: balance > 0 ? "#32a852" : "#ff0000"})
      ROIArray.push({y: ROI, date: date, color: ROI > 0 ? "#0e6124" : "#8E0011"})
      return {}
    })
    return [valueArray, ROIArray]
  }

  useEffect(() => {
    if(allStocks.length === 0)
      dispatch(fetchStock())
  }, [])

  useEffect(() => {
    if(allStocks.length === 0) return
    const saledData = allStocks.filter((it)=>it.income !== 0 )
    const handleDateData = saledData.map((it)=>{
      return {...it, sale_date: it.sale_date.substr(0, 7)}
    })
    const categories = getDate(allStocks)
    const monthValue = getValue(categories, handleDateData)
    const yearCategories = getYearDate(allStocks)
    const yearValue = getYearValue(yearCategories, handleDateData)

    const yearDividendInfo = {}
    let perDividendInfo = [] 
    const isDividend = record => (/股利/).test(record.source)
    api.getAccountRecord().then((accountRecord)=>{
      accountRecord.map(record => {
      // YearDividend
      if(!yearDividendInfo[record.transferTime.substring(0,4)] && isDividend(record)) {
        yearDividendInfo[record.transferTime.substr(0,4)] = []
        yearDividendInfo[record.transferTime.substr(0,4)].push(record)
      }else if(isDividend(record)){
        yearDividendInfo[record.transferTime.substr(0,4)].push(record)
      }
      // Dividend
      if(isDividend(record) && !perDividendInfo.flat().includes(record.source)){
        perDividendInfo.push([record.source, Number(record.transfer)])
      }
      else if(isDividend(record) && perDividendInfo.flat().includes(record.source)){
        perDividendInfo.forEach(dividend => {
          if(dividend[0] === record.source) dividend[1] += Number(record.transfer)
        })
      }
    })
    })

    setDividendInfo({
      yearDividend: yearDividendInfo,
      perDividend: perDividendInfo,
      chartInfo:{
        categories,
        monthValue: monthValue[0],
        monthRate: monthValue[1],
        yearCategories,
        yearValue
      }
    })

  }, [allStocks]);

  return (
    <Grid container style={{justifyContent: "center"}}>
        <div className="btn-group col-sm-12" role="group" aria-label="Basic example" style={{padding: 0}}>
          <button type="button" className={`btn btn-info ${chartTab === "monthIncome" && 'active'}`} onClick={()=> setChartTab("monthIncome")}>{t("chart.monthIncomeChart")}</button>
          <button type="button" className={`btn btn-info ${chartTab === "yearIncome" && 'active'}`} onClick={()=> setChartTab("yearIncome")}>{t("chart.yearIncomeChart")}</button>
          <button type="button" className={`btn btn-info ${chartTab === "dividend" && 'active'}`} onClick={()=> setChartTab("dividend")} >{t("chart.dividendChart")}</button>
          <button type="button" className={`btn btn-info ${chartTab === "report" && 'active'}`} onClick={()=> setChartTab("report")} >{t("chart.yearIncomeReport")}</button>
        </div>
        {chartTab === "monthIncome" && <Grid item xs={12} md={6}>
          <DualColumnChart chartInfo={dividendInfo.chartInfo} monthValue={dividendInfo.chartInfo.monthValue} type={'year'}/>
        </Grid>}
        {chartTab === "yearIncome" && <Grid item xs={12} md={6}>
          <YearColumnChart chartInfo={dividendInfo.chartInfo} type={'year'} dividend={dividendInfo.yearDividend}/>
        </Grid>}
        {chartTab === "dividend" && <Grid item xs={12} md={6}>
          <DividendChart perDividend={dividendInfo.perDividend}/>
        </Grid>}
        {chartTab === "report" && <Grid item xs={12} md={6}>
          <Report allStocks={allStocks} chartInfo={dividendInfo.chartInfo}/>
        </Grid>}
    </Grid>
      )
}


export default TwChart