import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const SummaryInfo = styled("div")
`
  display: flex;
`;

const ChartTitle = styled("div")
`
  margin: 5px;
  width: 50%;
  text-align: left;
  font-size: 20px;
  color: #6495ed;
`;
const ChartValue = styled("span")
`
  text-align: left;
  font-size: 20px;
  color: #ff0000;
`;
const DividendChart = ({ perDividend }) => {
    const [totalDividend, setTotalDividend] = useState(0)
    const chartComponentRef = useRef(null);
    const { t } = useTranslation();
    const options = {
        chart: {
            animation: {
                duration: 500,
            },
            marginRight: 50,
        },
        title: {
            text: t("chart.dividendChart"),
            align: "left",
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
            name: 2023,
            data: perDividend
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

    useEffect(() => {
        let accumulatorDividend = 0
        perDividend.reduce((accumulator, currentValue) => {
                if (accumulator && !isNaN(accumulator.y))
                    accumulatorDividend += accumulator.y
                if (!isNaN(currentValue.y))
                    accumulatorDividend += currentValue.y
                return {}
            }, 0
        );
        setTotalDividend(accumulatorDividend)
    }, [])

    return ( 
        <div style = {{ height: "60vh" }} >
            <SummaryInfo >
                <ChartTitle > 
                    { t("tDividend") } < ChartValue > { totalDividend  + t('twDollars')} </ChartValue> 
                </ChartTitle > 
            </SummaryInfo> 
        <HighchartsReact 
        highcharts = { Highcharts }
        options = { options }
        usRef = { chartComponentRef }
        /> 
        </div>
    );
};

export default DividendChart;