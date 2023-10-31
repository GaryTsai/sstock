import React, { useEffect, useRef, useState } from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const [yearDividend, setYearDividend] = useState([]);

    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const options = {
      chart:{
        height: '70%',
        type: 'column'
      },
      title: {
        text: t("chart.yearIncomeChart")
      },
      xAxis: {
        categories: chartInfo.yearCategories,
        lineWidth: 1, 
      },
      yAxis: [{ // Primary yAxis
        lineWidth: 1,  
        labels: {
          format: '{value} ' + t("twDollars"),
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: t("twMoney"),
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      },
      
    ],
      series: [
        { name: t("income"),
          type: 'column',  
          data: chartInfo.yearValue,
          tooltip: {
            valueSuffix: ' ' + t("twDollars"), 
          }
        },
        { name: t("chart.dividend"),
        type: 'column',  
        data: yearDividend,
        tooltip: {
          valueSuffix: ' ' + t("twDollars"),
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
    <ChartTitle>{t("tIncome")}<ChartValue>{getSummary()}</ChartValue></ChartTitle>
    </SummaryInfo>
    <HighchartsReact
        highcharts={Highcharts}
        options={options}
        usRef={chartComponentRef}
    />
    </div>)
}

export default  ColumnChart