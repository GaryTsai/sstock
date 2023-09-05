import React from "react"
import style from "./style"
import browserUtils from './../../utils/browserUtils'
const { reportFormat, reportFormatMobile, summaryTitle, summaryFontSize } = style

const SummaryList = ({ title, value }) => {
    const isMobile = browserUtils.isMobile()
    return (<div style={isMobile ? reportFormatMobile : reportFormat}>
        <div style={summaryTitle}> {title} </div>
        <div style={summaryFontSize}> {value} </div>
    </div>)

}
export default SummaryList