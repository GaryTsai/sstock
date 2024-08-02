import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TextField, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const Container = styled("div")`
  display: flex;
  align-items: center;
  margin: 5px;
`;
const ChartTitle = styled("div")`
  display: flex;
  /* flex-basis: 25%;; */
  text-align: left;
  font-size: 20px;
  color: #6495ed;
  @media (max-width: 768px){
    justify-content: space-between;
  }
`;
const ChartValue = styled("span")`
  text-align: left;
  font-size: 20px;
  color: #ff0000;
`;

const DropDownContainer = styled("div")`
  display: flex;
  flex-grow: 1;  
  align-items: center;
  @media (max-width: 768px){
    justify-content: space-between;
  }
`;

const StyledDiv = styled("div")`
  display: flex;
  white-space: nowrap;
  align-self: center;
  font-size: 20px;
  color: #6495ed;
  &:after {
    content: "\xa0\xa0";
  }
`;


const DualColumnChart = ({ yearDividendInfo }) => {
  const [selectTimeRange, setSelectTimeRange] = useState('all');
  const [selectList, setSelectList] = useState([{value: 'all', label: 'all'}]);
  const [info, setInfo] = useState({ value: [], date: [] });
  const chartComponentRef = useRef(null);
  const { t } = useTranslation();
  useEffect(() => {
    let yearList = []
    for (const [key, value] of Object.entries(yearDividendInfo)) {
      yearList.push(key)
    } 
    let selectYear = [{value: 'all', label: 'all'}]
    for (const year of yearList) {
      selectYear.push({value: year, label: year})
    } 
    setSelectList(selectYear);
  }, []);

  useEffect(() => {
    let yearList = []
    for (const [key, value] of Object.entries(yearDividendInfo)) {
      yearList.push(key)
    } 

    let monthDateList = []
    let monthDividendMap = {}
    let monthDividendList = []
    for(let year of yearList){
      for(let i = 1; i < 13; i++){
        monthDateList.push(`${year}-${i < 10 ? '0'+i: i}`)
        monthDividendMap[`${year}-${i < 10 ? '0'+i: i}`] = 0
      }
    }

    for (const [key, items] of Object.entries(yearDividendInfo)) {
      for(let item of items){
        monthDividendMap[item.transferTime.substring(0, 7)] += item.transfer
      }
    } 

    for (const [key, items] of Object.entries(monthDividendMap)) {
      monthDividendList.push(items)
    } 

    setInfo({
      value: monthDividendList,
      date: monthDateList,
    });
  }, []);

  const setDividendInfoGForAll = () => {
    let yearList = []
    for (const [key, value] of Object.entries(yearDividendInfo)) {
      yearList.push(key)
    } 

    let monthDateList = []
    let monthDividendMap = {}
    let monthDividendList = []
    for(let year of yearList){
      for(let i = 1; i < 13; i++){
        monthDateList.push(`${year}-${i < 10 ? '0'+i: i}`)
        monthDividendMap[`${year}-${i < 10 ? '0'+i: i}`] = 0
      }
    }

    for (const [key, items] of Object.entries(yearDividendInfo)) {
      for(let item of items){
        monthDividendMap[item.transferTime.substring(0, 7)] += item.transfer
      }
    } 

    for (const [key, items] of Object.entries(monthDividendMap)) {
      monthDividendList.push(items)
    } 

    setInfo({
      value: monthDividendList,
      date: monthDateList,
    });
  }

  useEffect(()=>{
    let monthDividendMap = {}
    let monthDateList = []
    let monthDividendList = []
    if(selectTimeRange === 'all'){
      setDividendInfoGForAll()
    } else {
      for(let i = 1; i < 13; i++){
          monthDateList.push(`${selectTimeRange}-${i < 10 ? '0'+i: i}`)
          monthDividendMap[`${selectTimeRange}-${i < 10 ? '0'+i: i}`] = 0
      }

      for (let monthDividend of  Object.keys(monthDividendMap)){
        for (const [key, item] of Object.entries(yearDividendInfo[selectTimeRange])) {
          if(monthDividend === item.transferTime.substring(0, 7))
            monthDividendMap[monthDividend] += item.transfer
        }
      }

      for (const [key, item] of Object.entries(monthDividendMap)) {
        monthDividendList.push(item)
      } 

      setInfo({
        value: monthDividendList,
        date: monthDateList,
      });
    }
  }, [selectTimeRange])

  const getSummary = () => {
    if (!info.value) return;

    if (info.value.length === 0) return;
    let result = info.value.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );
    return result;
  };

  const options = {
    chart: {
      height: "70%",
      type: "column",
      alignTicks: true
    },
    title: {
      text: t("chart.monthIncomeChart"),
    },
    xAxis: [
      {
        type: "category",
        categories: info.date,
      },
      {
        type: "category",
        categories: info.date,
        linkedTo: 0,
        labels: {
          enabled: false,
        },
        offset: 0,
      },
    ],
    yAxis: [
      { 
        softMax: info.value ? Math.max(...info.value.map(item => item.y)) : 0,
        softMin: info.value ? Math.min(...info.value.map(item => item.y)) : 0,
        lineWidth: 1,
        gridLineWidth: 3,//Set this to zero
        labels: {
          format: "{value} " + t("twMoney"),
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        title: {
          text: t("twMoney"),
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        opposite: false,
      },

    ],
    series: [
      {
        name: t("income"),
        data: info.value,
        tooltip: {
          valueSuffix: t("twDollars"),
        },
      },
      // {
      //   name: "投報率",
      //   data: info.rate,
      //   tooltip: {
      //     valueSuffix: " %",
      //   },
      //   yAxis: 1,
      // },
    ]
  };

  return (
    
    <div style={{ height: "60vh"}}>
      <Container className="row">
        <ChartTitle className="col-sm-12 col-md-6">
          {`${t("chart.yearDividendChart")}:`}<ChartValue>{ getSummary() + t('twDollars')}</ChartValue>
        </ChartTitle>
        <DropDownContainer className="col-sm-12 col-md-6">
          <StyledDiv>
          {t("chart.yearSelect")}
          </StyledDiv>
          <TextField
            id="outlined-select-year"
            select
            value={selectTimeRange}
            onChange={(e) => setSelectTimeRange(e.target.value)}
            sx={{
              height: "30px",
              width: '75%',
              '& .MuiOutlinedInput-root':{
                height:"30px",
                margin: "0px 5px"
              },
              '& legend':{
                width: 0,
              },
              '@media (max-width: 768px)': {
                width: '25%',
              }
            }}
         >
            {selectList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DropDownContainer>
      </Container>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </div>
  );
};

export default DualColumnChart;
