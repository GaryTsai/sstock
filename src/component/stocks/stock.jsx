import React, {useRef, useEffect, useState} from 'react';
import { BiSolidArrowToTop } from "react-icons/bi";
import { useLocation } from 'react-router-dom';
import { fetchStock } from '../../slices/apiDataSlice';
import api from '../../api/api';
import { useDispatch } from 'react-redux';
import { changeContentLoading } from '../../slices/mutualState';
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next';

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
                const stockInfo = {'price': salePrice, 'sheet': stock.sheet, 'cost': stock.cost, 'date': stock.date, 'purchaseTimestamp': stock.timestamp};
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
    if(stock.status === 'unsale') {
        api.deleteStock(stock.timestamp)
    }
    dispatch(fetchStock())
    api.updateDataForDeleteStock(stock).then(()=>{
        dispatch(changeContentLoading(false))
    })
  };

  const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
  }
  const { stock, index, isMerge } = props;
  const averagePrice = parseFloat((stock.price * 1.001425).toFixed(2));
  const handlingFee = stock.price * 1000 * stock.sheet * 0.001424 < 20 ? 20 : Math.round(stock.price * 1000 * stock.sheet * 0.001424);
  const isStockHistory = location.pathname === '/stockHistory'
  
  return (
    <>
        {
          isTopBtnShow && 
          <div style={{position: "absolute"}}>
            <div style={{
              position: "fixed",
              right: "25px",
              bottom: "25px",
              width: "50px",
              height: "50px",
              fontSize: "40px",
              backgroundColor: "cornflowerblue",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "black"}} onClick={() =>  window.scrollTo({top: 0, behavior: 'smooth'})}>
                <BiSolidArrowToTop />
              </div>
          </div>
        }
        <tr>
          <th scope="row">{index}</th>
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
          {  (!isStockHistory && isMerge === false && stock.status === 'unsale')  && <td>{stock.date}</td>}
          { isStockHistory && <td>{stock.date}</td>}
          { isStockHistory && (stock.status === 'sale' ? <td>{stock.sale_date}</td> : <td></td>)}
          <td>{stock.name}</td>
          <td>{stock.number}</td>
          <td>{isMerge ? (averagePrice / (stock.sheet)).toFixed(4) : averagePrice }</td>
          <td>{isFloat(stock.sheet) ? stock.sheet.toFixed(3) : stock.sheet}</td>
          <td>{isMerge ? stock.handingFee : Math.floor(handlingFee)}</td>
          <td>{Math.floor(stock.cost)}</td>
          <td>{stock.status === "unsale" ? t("inputRegion.unsale") : t("inputRegion.sale")}</td>
          <td>{Math.floor(stock.sale_cost)}</td>
          <td style={{ 'color': stock.income < 0 ? '#30ff30' : 'rgb(255 19 19)'}}>{Math.floor(stock.income)}</td>
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