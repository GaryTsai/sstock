import React, {useRef, useEffect, useState} from 'react';
import { BiSolidArrowToTop } from "react-icons/bi";
const Stock = (props) =>{
  const priceRef = useRef(null);
  const sheetRef = useRef(null);
  const [isTopBtnShow, setIsTopBtnShow] = useState(false)

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
    const salePrice = parseInt(priceRef.current.value);
    if((stock.sheet < sheetRef.current.value) || isNaN(salePrice) || !salePrice )
      alert('賣出張數錯誤');
    else{
      props.stockSaleCallback(priceRef.current.value,sheetRef.current.value,stock);
      priceRef.current.value = '';
      sheetRef.current.value = '';
    }
  };

  const deleteStock = () => {
    const { stock } = props;
    props.deleteCallback(stock);
  };

  const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
  }
  const { stock, saleStatus, index, route, isMerge } = props;
  const averagePrice = stock.price * 1.001425.toFixed(2);
  const handlingFee = stock.price * 1000 * stock.sheet * 0.001424 < 20 ? 20 : Math.round(stock.price * 1000 * stock.sheet * 0.001424);

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
          {isMerge === false && !props.hideFiled && <td key={stock.timestamp}>
            {<button type="button" className="btn btn-info" data-toggle="modal" data-target={`#modal-${stock.timestamp}`}>賣出</button>}
            <div>
              <div className="modal fade" id={`modal-${stock.timestamp}`} tabIndex="-1" role="dialog"
                   aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" style={{color:'black'}} id="exampleModalLabel">賣出資訊</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <h5 style={{ color: 'black', textAlign: 'left'}} key={'price' + index} htmlFor={`price-name-${index}`} className="col-form-label">賣出單價:</h5>
                        <input type="text" className="form-control"  id={`price-name-${index}`} ref={priceRef} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary"  data-dismiss="modal" aria-label="Close"onClick={ updateStockStatus}>確認{stock.name}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>}
          {  (route ==='accountInfo'  && isMerge === false && stock.status === 'sale') && <td>{stock.sale_date}</td>}
          {  (route ==='accountInfo'  && isMerge === false && stock.status === 'unsale')  && <td>{stock.date}</td>}
          { route !=='accountInfo' && isMerge === false &&(saleStatus === 'all' || saleStatus === 'sale') && (stock.status === 'sale' ? <td>{stock.sale_date}</td> : <td></td>)}
          { route !=='accountInfo' && isMerge === false &&(saleStatus === 'all' || saleStatus === 'unsale') && (stock.status === 'unsale' ? <td>{stock.date}</td>: <td>{stock.date}</td>)}
          <td>{stock.name}</td>
          <td>{stock.number}</td>
          <td>{isMerge ? (averagePrice / (stock.sheet)).toFixed(2) : averagePrice }</td>
          <td>{isFloat(stock.sheet) ? parseFloat(stock.sheet).toFixed(3) : stock.sheet}</td>
          <td>{isMerge ? parseFloat(stock.cost - averagePrice * 1000).toFixed(0) : Math.floor(handlingFee)}</td>
          <td>{Math.floor(stock.cost)}</td>
          <td>{stock.status === "unsale" ? '未賣出' : '已賣出'}</td>
          <td>{Math.floor(stock.sale_cost)}</td>
          <td style={{ 'color': stock.income < 0 ? '#30ff30' : 'rgb(255 19 19)'}}>{Math.floor(stock.income)}</td>
          { isMerge === false && <td>
            <button type="button" className="btn btn-danger" onClick={deleteStock}>刪除</button>
          </td> }
        </tr>
  </>
  )
}

export default Stock