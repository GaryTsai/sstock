import React, {useRef, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next';
import { BiSolidArrowToTop } from "react-icons/bi";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from "@mui/material";

import { fetchStock } from '../../slices/apiDataSlice';
import api from '../../api/api';
import { changeContentLoading, changeStocksDetail, showStocksDetail } from '../../slices/mutualState';
import './style.css'
import settings from './../../settings'

const { HANDLING_CHARGE_RATE, MINIMUM_HANDLING_FEE, BREAK_EVEN_RATE } = settings

const Stock = (props) =>{
  const priceRef = useRef(null);
  const [isTopBtnShow, setIsTopBtnShow] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    window.addEventListener('scroll', () => {

      if(document.documentElement.scrollTop > 0 ){
        setIsTopBtnShow(true)
      } else {
        setIsTopBtnShow(false)
      }

    })
  }, [])
  
  const updateStockStatus = () => {
    const {stock} = props;
    const salePrice = parseFloat(priceRef.current.value);
    if(isNaN(salePrice) || !salePrice )
      Swal.fire({
        icon: 'error',
        title: t("alertError"),
        text: t("fieldInputWarning_Price")
      })
    else{
            dispatch(changeContentLoading(true))
            api.updateStock(salePrice, stock.sheet, stock).then(() => {
                const stockInfo = {'price': salePrice, 'sheet': stock.sheet, 'cost': stock.cost, 'date': stock.date, 'purchaseTimestamp': stock.timestamp, 'number': stock.number};
                api.updateAccountRecord(stockInfo, true);
                dispatch(fetchStock())
                dispatch(changeContentLoading(false))
                }
            )
        priceRef.current.value = '';
    }
  };

  const handleDeleteStock = () => {
    const { stock } = props;
    dispatch(changeContentLoading(true))
    api.updateDataForDeleteStock(stock).then(()=>{
        if(stock.status === 'unsale') {
          api.deleteStock(stock.timestamp)
          dispatch(fetchStock())
        }
        dispatch(changeContentLoading(false))
    })
  };

  const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
  }

  const { stock, index, isMerge, stockRealtimePrice, stockRealtimePriceStatus, stockRealtimePriceOffset, bgColor, isStocksDetail} = props;
  const averagePrice = parseFloat((stock.price * (1 + HANDLING_CHARGE_RATE)).toFixed(2));
  const breakEvenPrice = parseFloat((stock.price * (1 + BREAK_EVEN_RATE)).toFixed(2));
  const handlingFee = stock.price * 1000 * stock.sheet * HANDLING_CHARGE_RATE < MINIMUM_HANDLING_FEE ? MINIMUM_HANDLING_FEE : Math.round(stock.price * 1000 * stock.sheet * HANDLING_CHARGE_RATE);
  const isStockHistory = location.pathname === '/sstock/stockHistory'
  const currentStockPage = location.pathname === '/sstock' || location.pathname === '/sstock/'
  const TDmergeInfoHover = styled('td')(({ isMerge, isStocksDetail }) => ({
    ':hover': {
      backgroundColor: isMerge && !isStocksDetail ? '#4d657d' : 'unset'
    }
    }));
  
  return (
    <>
        {
          isTopBtnShow && 
          <div style={{position: "absolute"}}>
            <div className='arrowToTop' onClick={() =>  window.scrollTo({top: 0, behavior: 'smooth'})}>
                <BiSolidArrowToTop />
              </div>
          </div>
        }
        <tr style={{backgroundColor: `${isStocksDetail && bgColor}` }}>
          <th scope="row" style={{ fontSize: !isStocksDetail && '15px', color: !!isStocksDetail && 'black'}} >{index}</th>
          {!isStockHistory && isMerge === false && <td key={stock.timestamp}>
            {<button type="button" className="btn btn-info" data-toggle="modal" data-target={`#modal-${stock.timestamp}`}>{t("sell")}</button>}
            <div>
              <div className="modal fade" id={`modal-${stock.timestamp}`} tabIndex="-1" role="dialog"
                   aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" style={{color:'black'}} id="exampleModalLabel">{t("sellInfo")}</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <h5 style={{ color: 'black', textAlign: 'left'}} key={'price' + index} htmlFor={`price-name-${index}`} className="col-form-label">{t("sellPrice")}:</h5>
                        <input type="text" className="form-control"  id={`price-name-${index}`} ref={priceRef} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary"  data-dismiss="modal" aria-label="Close"onClick={ updateStockStatus}>{t("confirm")}{stock.name}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>}
          { (!isStockHistory && isMerge === false && stock.status === 'unsale')  && <td>{stock.date}</td>}
          { isStockHistory && <td>{stock.date}</td>}
          { isStockHistory && (stock.status === 'sale' ? <td>{stock.sale_date}</td> : <td></td>)}
          {<TDmergeInfoHover
            isStocksDetail={isStocksDetail}
            isMerge={isMerge}
            onClick={()=> {
            if(isStocksDetail)
              return 
            dispatch(showStocksDetail(stock.number))
            dispatch(changeStocksDetail())
            }} style={{cursor: !isStocksDetail && isMerge && 'pointer' }}>{stock.name}</TDmergeInfoHover>}
          <td>{stock.number}</td>
          <td>{isMerge ? (averagePrice / (isStocksDetail ? 1 : stock.sheet)).toFixed(2) : averagePrice }</td>
          { !isStockHistory && isMerge && <td>{(breakEvenPrice / (isStocksDetail ? 1 : stock.sheet)).toFixed(2)}</td> }
          { isStocksDetail ? <td></td> : currentStockPage && isMerge && <td style={{'color': stockRealtimePriceOffset && stockRealtimePriceOffset[stock.number] <= 0 ? '#1ec41e' : '#e55454'}}>{stockRealtimePriceStatus === false ? <div class="loader"></div> : stockRealtimePrice && stockRealtimePrice[stock.number] ? parseFloat(stockRealtimePrice[stock.number]).toFixed(2) +' '+ `(${stockRealtimePriceOffset[stock.number]})`: ''}</td> }
          { isStocksDetail ? <td></td> : currentStockPage && isMerge && <td style={{'color': ((breakEvenPrice / stock.sheet).toFixed(4) > (stockRealtimePriceStatus === true && stockRealtimePrice && stockRealtimePrice[stock.number] && parseFloat(stockRealtimePrice[stock.number]).toFixed(2))) ? '#1ec41e' : '#e55454'}}>{stockRealtimePriceStatus === false ? <div class="loader"></div> : stockRealtimePrice && stockRealtimePrice[stock.number] ? `${(parseFloat(stockRealtimePrice[stock.number]).toFixed(2) - (breakEvenPrice / (stock.sheet)).toFixed(2)).toFixed(2)}`: ''}</td> }
          { isStocksDetail ? <td></td> : currentStockPage && isMerge && <td style={{'color': ((breakEvenPrice / stock.sheet).toFixed(4) > (stockRealtimePriceStatus === true && stockRealtimePrice && stockRealtimePrice[stock.number] && parseFloat(stockRealtimePrice[stock.number]).toFixed(2))) ? '#1ec41e' : '#e55454'}}>{stockRealtimePriceStatus === false ? <div class="loader"></div> : stockRealtimePrice && stockRealtimePrice[stock.number] ? `${((parseFloat(stockRealtimePrice[stock.number]).toFixed(2) - (breakEvenPrice / (stock.sheet)).toFixed(2)).toFixed(2) * 1000 * stock.sheet).toFixed(0)}`: ''}</td> }
          <td>{isFloat(stock.sheet) ? stock.sheet.toFixed(3) : stock.sheet}</td>
          <td>{currentStockPage && isMerge ? stock.handingFee : Math.floor(handlingFee)}</td>
          <td>{Math.floor(stock.cost)}</td>
          <td>{stock.status === "unsale" ? t("inputRegion.unsale") : t("inputRegion.sale")}</td>
          { isStockHistory && <td>{stock.sale_price === 0 ? '' : stock.sale_price}</td>}
          { isStockHistory && <td>{Math.floor(stock.sale_cost)}</td>}
          { isStockHistory && <td style={{ 'color': stock.income < 0 ? '#30ff30' : 'rgb(255 19 19)'}}>{Math.floor(stock.income)}</td>}
          { !isStockHistory && isMerge === false && <td>
            <button type="button" className="btn btn-danger" onClick={handleDeleteStock}>{t("delete")}</button>
          </td>}
          {/* { isStockHistory && stock.status === 'sale' ? <td>
            <button type="button" className="btn btn-danger" onClick={handleDeleteStock}>刪除</button>
          </td> : <td><div style={{ height: '38px'}} ></div></td>} */}
        </tr>
  </>
  )
}

export default Stock