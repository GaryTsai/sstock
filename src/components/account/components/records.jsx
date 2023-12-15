import React from 'react'
import Record from './record'


const Records = ({recordsLoading, records}) => {
  return (
    <>
        {
            !recordsLoading && records.map((record, index) => (
            <Record key={index} record={record} index={index}/>
            ))
        }
        {
            recordsLoading && <div className="content-loading">
                <img  alt="" className="content-loading-img"src={require('./../../../assets/img/contentLoading.png')}/>
            </div>
        }
    </>
  )
}
export default Records