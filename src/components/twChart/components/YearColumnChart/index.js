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
  perDividend,
  dividend
}) => {
    const { t } = useTranslation();
    const [yearDividend, setYearDividend] = useState([]);
    const [showPerDividend, setShowPerDividend] = useState(false);
    const [dividendMap, setDividendMap] = useState([]);

    const [year, setYear] = useState(null);
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
      plotOptions: {
        series: {
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(!dividend[event.point.category])
                      return 
                    dividend[event.point.category].map((record)=>{
                      if(!dividendMap.flat().includes(record.source)){
                        dividendMap.push([record.source, Number(record.transfer)])
                      }
                      else if(dividendMap.flat().includes(record.source)){
                        dividendMap.forEach( item => {
                          if(item[0] === record.source) {
                            item[1] += Number(record.transfer)
                          }
                        }) 
                      }
                      return {};
                    })
                    setDividendMap(dividendMap)
                    setYear(event.point.category)
                    setShowPerDividend(true)
                }
            }
        }
      }
    }
    const perDividendOptions = {
      chart: {
          animation: {
              duration: 500,
          },
          marginRight: 50,
      },
      title: {
          text: `<span style="color: #cc2222;">${year} ${ t("chart.yearDividendChart") }:</span>` + dividendMap.reduce((previousValue, currentValue, idx, diviends)=>previousValue + currentValue[1] , 0) + t("twDollars"),
          align: "right",
          style:{
            color: "#333333",
            fontWeight: "bold"
          },
          useHTML:true
      },
      subtitle: {
          useHTML: true,
          floating: true,
          align: "right",
          verticalAlign: "middle",
          y: -80,
          x: -100,
          
      },
      legend: {
          enabled: false,
      },
      xAxis: {
          type: "category",
      },
      yAxis: {
          opposite: true,
          tickPixelInterval: 150,
          title: {
              text: null,
          },
      },
      plotOptions: {
          series: {
              animation: false,
              groupPadding: 0,
              pointPadding: 0.1,
              borderWidth: 0,
              colorByPoint: true,
              dataSorting: {
                  enabled: true,
                  matchByName: true,
              },
              type: "bar",
              dataLabels: {
                  enabled: true,
              },
          },
      },
      series: [{
          type: 'bar',
          name: year,
          data: dividendMap
      }],
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 550
              },
              chartOptions: {
                  xAxis: {
                      visible: false
                  },
                  subtitle: {
                      x: 0
                  },
                  plotOptions: {
                      series: {
                          dataLabels: [{
                              enabled: true,
                              y: 8
                          }, {
                              enabled: true,
                              format: '{point.name}',
                              y: -8,
                              style: {
                                  fontWeight: 'normal',
                                  opacity: 0.7
                              }
                          }]
                      }
                  }
              }
          }]
      }

  };
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
    <SummaryInfo>
    <ChartTitle>{t("tIncome")}<ChartValue>{getSummary() + t('twDollars')}</ChartValue></ChartTitle>
    <ChartTitle> 
                { t("tDividend") } < ChartValue> { yearDividend.reduce((previousValue, currentValue) => previousValue + currentValue, 0)  + t('twDollars')} </ChartValue> 
                </ChartTitle> 
    </SummaryInfo>
    {showPerDividend && <> <button type="button" className="btn btn-warning"  style={{display: "flex",alignItems: "center", position: "absolute", zIndex: 1}} 
    onClick={()=> {
      setDividendMap([])
      setShowPerDividend(false)
    }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
      </svg>
      {t("chart.back")}
    </button>
    <HighchartsReact
        highcharts={Highcharts}
        options={perDividendOptions}
        usRef={chartComponentRef}
    /></>}
    {!showPerDividend &&<HighchartsReact
    highcharts={Highcharts}
    options={options}
    usRef={chartComponentRef}
    />}
    </div>)
}

export default  ColumnChart