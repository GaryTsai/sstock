import React, { Component, useEffect, useState } from 'react'
import BarChart from '../../custom/BarChart'
import _ from 'lodash';
import { styled } from '@mui/material/styles';
const Container = styled('div')`
  display: flex;
`
const TwChart = ({
  allStocks, 
  route
}) => {
  const [categories, setCategories] = useState([])
  const [value, setValue] = useState([])
  const [yearCategories, setYearCategories] = useState([])
  const [yearValue, setYearValue] = useState([])

  const getDate = data => {
    if(data.length === 0) return 
    const firstDateYear = data[data.length-1].date.substring(0 ,4)
    const firstDateMonth = data[data.length-1].date.substring(5 ,7)
    const lastDateYear = new Date().getFullYear()
    const lastDateMonth = new Date().getMonth()
    let dateArray = []
    for(let year = firstDateYear; year <= lastDateYear; year++ ){
      for(let month = (year === firstDateYear ? firstDateMonth : 1 ); month <= (year === lastDateYear ? lastDateMonth : 12 ); month++ ){
        if(month.toString().length <=1 && month !== 0)
          dateArray.push(`${year}-0${month}`)
        else
          dateArray.push(`${year}-${month}`)
      }
    }
    return dateArray.splice(7)
  }

  const getYearValue = (categories, data) =>{
    if(data.length === 0) return 
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
    if(data.length === 0) return 
    const firstDateYear = data[data.length-1].date.substring(0 ,4)
    const lastDateYear = new Date().getFullYear()
    let yearArray = []
    for(let year = firstDateYear; year <= lastDateYear; year++ ){
      yearArray.push(`${year}`)
    }
    return yearArray
  }

  const getValue = (categories, data) =>{
    if(data.length === 0) return 
    let valueArray = []
    categories.map((date)=>{
      let balance = 0
      data.forEach(it => {
        if(it.sale_date === date){
          balance += it.income
        }
      })
      valueArray.push({y: balance, color: balance > 0 ? "#32a852" : "#ff0000"})
    })

    return valueArray.splice(5)
  }

  useEffect(() => {
    if(!allStocks) return
    const saledData = allStocks.filter((it)=>it.income !== 0 )
    const handleDateData = saledData.map((it)=>{
      return {...it, sale_date: it.sale_date.substr(0, 7)}
    })
    const categories = getDate(allStocks)
    const value = getValue(categories, handleDateData)
    const yearCategories = getYearDate(allStocks)
    const yearValue = getYearValue(yearCategories, handleDateData)
    
    setYearCategories(yearCategories || [])
    setYearValue(yearValue || [])
    setCategories(categories || [])
    setValue(value || [])
    

  }, [allStocks]);

  return (
      <Container>
        <BarChart categories={categories} value={value} type={'month'}/>
        <BarChart categories={yearCategories} value={yearValue} type={'year'}/>
      </Container>
    )
}


export default TwChart