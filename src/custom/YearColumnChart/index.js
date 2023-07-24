import React, { Component, useEffect, useRef, useState } from "react";
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { styled } from '@mui/material/styles';

const SummaryInfo = styled('div')`
  display: flex;
`

const ChartTitle = styled('div')`
  margin: 5px;
  width: 50%;
  text-align: left;
  font-size: 20px;
  color: #6495ED;	
`
const ChartValue = styled('span')`
  text-align: left;
  font-size: 20px;
  color: #FF0000;	
`
const ColumnChart = ({
  chartInfo = {},
  type,
  dividend
}) => {
    // if(JSON.stringify(chartInfo) === '{}') 
    const [yearDividend, setYearDividend] = useState([]);

    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const options = {
      chart:{
        height: '70%',
        type: 'column'
      },
      title: {
        text: '年損益圖表'
      },
      xAxis: {
        categories: chartInfo.yearCategories,
        lineWidth: 1, 
      },
      yAxis: [{ // Primary yAxis
        lineWidth: 1,  
        labels: {
          format: '{value} 元',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: '台幣',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      },
      
    ],
      series: [
        { name: '損益',
          type: 'column',  
          data: chartInfo.yearValue,
          tooltip: {
            valueSuffix: ' 元'
          }
        },
        { name: '股利',
        type: 'column',  
        data: yearDividend,
        tooltip: {
          valueSuffix: ' 元'
        }
      }
      ],
    }
    const getSummary = () => Object.keys(chartInfo).length !== 0 && chartInfo.yearValue.reduce((previousValue, currentValue) => previousValue + currentValue.y, 0)
    
    useEffect(()=>{
      if(JSON.stringify(chartInfo) === '{}') return 
      let _yearDividend = []
      chartInfo.yearCategories.map((year)=>{
        _yearDividend.push(dividend[year] ? dividend[year].reduce((allStockDividend, record)=>{
            allStockDividend += Number(record.transfer)
            return allStockDividend
          }, 0) : 0)
      })
      setYearDividend(_yearDividend)
    },[chartInfo])

  return (<div style={{ height: '60vh' }}>
    <SummaryInfo >
    <ChartTitle>總損益:<ChartValue>{getSummary()}</ChartValue></ChartTitle>
    </SummaryInfo>
    <HighchartsReact
        highcharts={Highcharts}
        options={options}
        usRef={chartComponentRef}
    />
    </div>)
}

export default  ColumnChart