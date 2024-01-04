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
  align-self: center;
  font-size: 20px;
  color: #6495ed;
  &:after {
    content: "\xa0\xa0";
  }
`;


const DualColumnChart = ({ chartInfo,  type }) => {
  const [selectTimeRange, setSelectTimeRange] = useState("all");
  const [selectList, setSelectList] = useState([{value:'all', label: 'all'}]);
  const [info, setInfo] = useState({ value: chartInfo.monthValue, rate: chartInfo.monthRate, date: chartInfo.categories });
  const chartComponentRef = useRef(null);
  const { t } = useTranslation();

  const getSummary = () => {
    if (!info.value) return;

    if (info.value.length === 0) return;
    let result = info.value.reduce(
      (previousValue, currentValue) => previousValue + currentValue.y,
      0
    );
    return result;
  };
  useEffect(() => {
    if(JSON.stringify(chartInfo) === '{}') return
    if(selectTimeRange !== 'all'){
      setInfo({
        value: chartInfo.monthValue.filter((item)=> new RegExp(`${selectTimeRange}`).test(item.date) && item),
        rate: chartInfo.monthRate.filter((item)=> new RegExp(`${selectTimeRange}`).test(item.date) && item),
        date: chartInfo.categories.filter((item)=> new RegExp(`${selectTimeRange}`).test(item) && item),
      });
    }else{
      setInfo({
        value: chartInfo.monthValue,
        rate: chartInfo.monthRate,
        date: chartInfo.categories,
      });
    }
  }, [selectTimeRange]);

  useEffect(() => {
    setInfo({
      value: chartInfo.monthValue,
      rate: chartInfo.monthRate,
      date: chartInfo.categories,
    });
  }, []);

  useEffect(() => {
    const arrayEquals = (arrOne, arrTwo) => {
      return Array.isArray(arrOne) &&
          Array.isArray(arrTwo) &&
          arrOne.length === arrTwo.length &&
          arrOne.every((item, index) => item['value'] === arrTwo[index]['value']);
  }
  
    if(JSON.stringify(chartInfo) === '{}') return
    let list = chartInfo.yearCategories && chartInfo.yearCategories.map((year) => {
      return { value: year, label: year };
    });

    if(!list){
      setSelectList(selectList)
    }else if( arrayEquals(selectList.slice(1), list)){
    }else {
      setSelectList(selectList.concat(list))
    }

    setInfo({
      value: chartInfo.monthValue,
      rate: chartInfo.monthRate,
      date: chartInfo.categories,
    });
  }, [chartInfo]);          

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
          {t("tIncome")}<ChartValue>{ getSummary() + t('twDollars')}</ChartValue>
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
