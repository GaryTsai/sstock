import React from "react"
import "./style.css"

const summaryTitle = {
    color: 'black'
}
const summaryFontSize = {
    fontSize: '24px'
}
const SummaryList = ({ title, value, color }) => {
    return (<div className="report-item">
        <div style={summaryTitle}> {title} </div>
        <div style={{color: color, ...summaryFontSize}}> {value} </div>
    </div>)

}
export default SummaryList