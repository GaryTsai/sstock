import React, { Component, useEffect, useState } from 'react'
import _ from 'lodash';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import YearColumnChart from '../../custom/YearColumnChart';
import DualColumnChart from '../../custom/DulaColumnChart';
import DividendChart from '../../custom/YearDividendChart';
import api from '../../api/api'

const Container = styled('div')`
  display: block;
`
const TwChart = ({
  allStocks=[], 
  route
}) => {

  const [chartInfo, setChartInfo] = useState({})
  const [dividend, setDividend] = useState(null)
  const [perDividend, setPerDividend] = useState(null)
  const [chartTab, setChartTab] = useState("monthIncome")

  const getDate = data => {
    const firstDateYear = data[data.length-1].date.substring(0 ,4)
    const firstDateMonth = data[data.length-1].date.substring(5 ,7)
    const lastDateYear = new Date().getFullYear()
    const lastDateMonth = new Date().getMonth() + 1
    let dateArray = []
    for(let year = firstDateYear; year <= lastDateYear; year++ ){
      for(let month = (year === firstDateYear ? firstDateMonth : 1 ); month <= (year === lastDateYear ? lastDateMonth : 12 ); month++ ){
        if(month.toString().length <=1 && month !== 0)
          dateArray.push(`${year}-0${month}`)
        else
          dateArray.push(`${year}-${month}`)
      }
    }
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
    })
    return [valueArray, ROIArray]
  }

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
    setChartInfo({
      categories,
      monthValue: monthValue[0],
      monthRate: monthValue[1],
      yearCategories,
      yearValue
    })
    return () => {
      allStocks = []
  };
  }, [allStocks]);

  useEffect(()=>{
    const dividendInfo = {}
    const fetchData = async () => {
      return  await api.getAccountRecord()
    }

    const isDividend = record => (/股利/).test(record.source)
    // YearDividend
    fetchData().then((accountRecord)=>{
      accountRecord.map(record => {
      if(!dividendInfo[record.transferTime.substring(0,4)] && isDividend(record)) {
        dividendInfo[record.transferTime.substr(0,4)] = []
        dividendInfo[record.transferTime.substr(0,4)].push(record)
      }else if(isDividend(record)){
      dividendInfo[record.transferTime.substr(0,4)].push(record)
      }
      })
      setDividend(dividendInfo)
    })
    // Dividend
    let dividendName = [] 
    fetchData().then((accountRecord)=>{
      accountRecord.map(record => {
        if(isDividend(record) && !dividendName.flat().includes(record.source)){
          dividendName.push([record.source, Number(record.transfer)])
        }
        else if(isDividend(record) && dividendName.flat().includes(record.source)){
          dividendName.forEach(dividend => {
            if(dividend[0] === record.source) dividend[1] += Number(record.transfer)
          })
        }
      })
      setPerDividend(dividendName)
    })
  },[])

  return (
    <Grid container style={{justifyContent: "center"}}>
        <div class="btn-group col-sm-12" role="group" aria-label="Basic example" style={{padding: 0}}>
          <button type="button" className={`btn btn-info ${chartTab === "monthIncome" && 'active'}`} onClick={()=> setChartTab("monthIncome")}>月損益圖</button>
          <button type="button" className={`btn btn-info ${chartTab === "yearIncome" && 'active'}`} onClick={()=> setChartTab("yearIncome")}>歷年損益圖</button>
          <button type="button" className={`btn btn-info ${chartTab === "dividend" && 'active'}`} onClick={()=> setChartTab("dividend")} >股息表</button>
        </div>
        {chartTab === "monthIncome" && <Grid item xs={12} md={6}>
          <DualColumnChart chartInfo={chartInfo} type={'year'}/>
        </Grid>}
        {chartTab === "yearIncome" && <Grid item xs={12} md={6}>
          <YearColumnChart chartInfo={chartInfo} type={'year'} dividend={dividend}/>
        </Grid>}
        {chartTab === "dividend" && <Grid item xs={12} md={6}>
          <DividendChart perDividend={perDividend}/>
        </Grid>}
    </Grid>
      )
}


export default TwChart