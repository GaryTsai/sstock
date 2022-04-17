import React, { Component, useRef } from "react";
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { styled } from '@mui/material/styles';

const ChartTitle = styled('div')`
  margin:0px 5%;
  text-align: left;
  font-size: 20px;
  color: #6495ED;	
`
const ChartValue = styled('span')`
  text-align: left;
  font-size: 20px;
  color: #FF0000;	
`
const BarChart = ({
  categories,
  value,
  type
}) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const options = {
      chart:{
        height: '70%'
      },
      title: {
        text: type === 'month' ? '月損益圖表' : '年損益圖表'
      },
      xAxis: {
        categories: categories,
      },
      series: [
        { name: '損益',
          type: 'column',  
          data: value,
          zoneAxis: 'x',
        }
      ],
    }
    
    const getSummary = () => {
      if(!value) return 
      let result = value.reduce((previousValue, currentValue) => previousValue + currentValue.y, 0)
      return result
    }

    return (<div style={{ height: '900px', width: "50%" }}>
    <ChartTitle>總損益: <ChartValue>{getSummary()}</ChartValue></ChartTitle>
    <HighchartsReact
        highcharts={Highcharts}
        options={options}
        usRef={chartComponentRef}
    />
    </div>)
}

export default  BarChart