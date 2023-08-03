import React, { useState, useEffect} from 'react'
import { styled } from "@mui/material/styles";
import { TextField, MenuItem } from "@mui/material";

const DropDownContainer = styled("div")`
  display: flex;
  flex-grow: 1;  
  align-items: center;
  margin-bottom: 5px;
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
const Container = styled("div")`
  margin: 5px;
  white-space: nowrap;
`;
const SPECIFIC_ICOME_PERCENT = 4
const Report = ({chartInfo, allStocks}) => {
const initialState = {
    startYear: chartInfo.yearCategories[0], 
    endYear: chartInfo.yearCategories[chartInfo.yearCategories.length-1],
    reportData: [],
    totalIncome: 0,
    totalSaleCost: 0,
    totalCost: 0,
    totalPercent: 0
}
const [reportInfo, setReportInfo] = useState(initialState)
useEffect(() => {
    let totalIncome = 0
    let totalSaleCost = 0
    let totalCost = 0
    allStocks.map((item) => {
        totalIncome += item.income
        totalCost += item.cost
        if(item.status === 'sale')
            totalSaleCost += item.cost
    })  
    setReportInfo({...reportInfo, totalIncome: totalIncome, totalSaleCost: totalSaleCost,totalCost: totalCost, totalPercent: (totalIncome/totalSaleCost * 100).toFixed(2)})
}, [])

const queryReport = () => {
    const data = []
    let yearUnsale = 0
    let yearIncome = 0
    let yearCost = 0
    for (let start = reportInfo.startYear; start <= reportInfo.endYear; start++) {
        yearCost = 0
        yearUnsale = 0
        yearIncome = 0

        allStocks.map((item)=>{

            if(item.status === 'unsale' && item.date.includes(start)){
                yearUnsale += item.cost
            }
            if(item.status === 'sale' && item.sale_date.includes(start)){
                yearIncome += item.income    
                yearCost += item.cost                 
            }
        })

        data.push({year: String(start), yearIncome: yearIncome, yearCost: yearCost, yearUnsale: yearUnsale, incomePercent: (yearIncome/yearCost * 100).toFixed(2)}) 
      }

      setReportInfo({...reportInfo, reportData: data})
}
const reverseData = Object.assign([], reportInfo.reportData)

  return (
    <Container>
    <DropDownContainer>
          <StyledDiv>
          {'選擇年份:'}
          </StyledDiv>
          <TextField
            id="outlined-select-year"
            select
            value={reportInfo.startYear}
            onChange={(e) => setReportInfo({
                ...reportInfo,
                startYear: e.target.value
            })}
            sx={{
              height: "30px",
              width: '35%',
              '& .MuiOutlinedInput-root':{
                height:"30px",
                margin: "0px 5px"
              },
              '& legend':{
                width: 0,
              }
            }}
          >
            {chartInfo.yearCategories.filter((year) => year <= reportInfo.endYear).map((year, index) => (
              <MenuItem key={index} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <StyledDiv>
          {'至:'}
          </StyledDiv>
          <TextField
            id="outlined-select-year"
            select
            value={reportInfo.endYear}
            onChange={(e) => setReportInfo({
                ...reportInfo,
                endYear: e.target.value
            })}
            sx={{
              height: "30px",
              width: '35%',
              '& .MuiOutlinedInput-root':{
                height:"30px",
                margin: "0px 5px"
              },
              '& legend':{
                width: 0,
              }
            }}
          >
            {chartInfo.yearCategories.filter((year) => year >= reportInfo.startYear).map((year, index) => (
              <MenuItem key={index} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <button type="button" className="btn btn-info" style={{ height: '30px', alignItems: 'center', display: 'flex'}} onClick={() => queryReport(reportInfo.startYear, reportInfo.endYear)}>確認</button>
        </DropDownContainer>
    <div className="table-responsive table-striped">
      <table className="table" style={{marginTop: '5rem'}}>
        <thead>
          <tr>
            <th>#</th>
            <th>年投報率(%)</th>
            <th>年損益</th>
            <th>該年投入(已賣出)</th>
            <th>該年投入(未賣出)</th>
          </tr>
        </thead>
        <tbody>
        {reverseData.reverse().map((yearInfo)=>{
                return <tr key={yearInfo.year}> <td>{yearInfo.year}</td>
                <td style={{color: yearInfo.incomePercent >= SPECIFIC_ICOME_PERCENT ? 'red' : 'green'}}>{yearInfo.incomePercent}</td>
                <td>{yearInfo.yearIncome}</td>
                <td>{yearInfo.yearCost}</td>
                <td>{yearInfo.yearUnsale}</td>
                </tr>
            })}
        </tbody>
      </table>
    </div>
    <div className="table-responsive">
      <table className="table" style={{marginTop: '5rem'}}>
        <thead>
          <tr>
            <th>#</th>
            <th>總投報率(%)</th>
            <th>歷年總損益</th>
            <th>歷年總投入(已賣出)</th>
            <th>歷年總投入</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>All</td>
            <td>{reportInfo.totalPercent}</td>
            <td>{reportInfo.totalIncome}</td>
            <td>{reportInfo.totalSaleCost}</td>
            <td>{reportInfo.totalCost}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </Container>
  );
}

export default Report