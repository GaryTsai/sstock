import React from "react"
import "./style.css"

const summaryTitle = {
    color: 'black'
}
const summaryFontSize = {
    fontSize: '24px'
}
const SummaryList = ({ title, value }) => {
    return (<div className="report-item">
        <div style={summaryTitle}> {title} </div>
        <div style={summaryFontSize}> {value} </div>
    </div>)

}
export default SummaryList