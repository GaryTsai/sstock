import React, { Component, useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TextField, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
const Container = styled("div")`
  display: flex;
`;
const ChartTitle = styled("div")`
  display: flex;
  flex-basis: 30%;
  margin: 0px 5%;
  text-align: left;
  font-size: 20px;
  color: #6495ed;
`;
const ChartValue = styled("span")`
  text-align: left;
  font-size: 20px;
  color: #ff0000;
`;

const DropDownContainer = styled("div")`
  display: flex;
  flex-grow: 1;
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

const DualColumnChart = ({ chartInfo, type,  dividend }) => {
  const [selectTimeRange, setSelectTimeRange] = useState("all");
  const [selectList, setSelectList] = useState([{value:'all', label: 'all'}]);
  const [info, setInfo] = useState({ value: [], rate: [], date: [] });
  const chartComponentRef = useRef < HighchartsReact.RefObject > null;

  const handleChange = (e) => {
    setSelectTimeRange(e.target.value);
  };
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
    if(JSON.stringify(chartInfo) === '{}') return
    let list = chartInfo.yearCategories && chartInfo.yearCategories.map((year) => {
      return { value: year, label: year };
    });
    if(!list){
      setSelectList(selectList)
    }else{
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
      alignTicks: true,
    },
    title: {
      text: "月損益圖表",
    },
    xAxis: [
      {
        type: "category",
        categories: info.categories,
      },
      {
        type: "category",
        categories: info.categories,
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
        labels: {
          format: "{value} 元",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        title: {
          text: "台幣",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        opposite: false,
      },
      // { 
      //   softMax: info.rate ? Math.max(...info.rate.map(item => item.y)) : 0,
      //   softMin: info.rate ? Math.min(...info.rate.map(item => item.y)) : 0,
      //   title: {
      //     text: "投報率",
      //     style: {
      //       color: Highcharts.getOptions().colors[1],
      //     },
      //   },
      //   labels: {
      //     format: "{value} %",
      //     style: {
      //       color: Highcharts.getOptions().colors[1],
      //     },
      //   },
      //   opposite: false,
      // },
    ],
    series: [
      {
        name: "損益",
        data: info.value,
        tooltip: {
          valueSuffix: " 元",
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
    <div style={{ height: "900px", width: "50%" }}>
      <Container>
        <ChartTitle>
          總損益: <ChartValue>{getSummary()}</ChartValue>
        </ChartTitle>
        <DropDownContainer>
          <StyledDiv>
          {'選擇年份:'}
          </StyledDiv>
          <TextField
            id="outlined-select-year"
            select
            value={selectTimeRange}
            onChange={handleChange}
            sx={{
              height:"30px",
              width: '75%',
              '& .MuiOutlinedInput-root':{
                height:"30px",
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
        usRef={chartComponentRef}
      />
    </div>
  );
};

export default DualColumnChart;
