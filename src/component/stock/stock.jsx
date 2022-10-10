import React, {Component} from 'react';

const initialState = {
};

export default class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
  }

  updateStockStatus = () => {
    const {stock} = this.props;
    const salePrice = parseInt(this.price.value);
    if((stock.sheet < this.sheet.value) || isNaN(salePrice) || !salePrice )
      alert('賣出張數錯誤');
    else{
      this.props.stockSaleCallback(this.price.value,this.sheet.value,stock);
      this.price.value = '';
      this.sheet.value = '';
    }
  };

  deleteStock = () => {
    const {stock} = this.props;
    this.props.delete(stock.timestamp);
  };

  isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
  }

  render() {
    const {stock, saleStatus, index, route, isMerge} = this.props;
    const averagePrice = stock.price*1.001425.toFixed(2);
    const handlingFee = stock.price*1000*stock.sheet*0.001424 < 20 ? 20 : Math.round(stock.price*1000*stock.sheet*0.001424);
 
    return (
        <tr>
          <th scope="row">{index}</th>
          {isMerge === false && !this.props.hideFiled && <td key={index}>
            {<button type="button" className="btn btn-info" data-toggle="modal" data-target={`#modal-${index}`}>賣出</button>}
            <div>
              <div className="modal fade" id={`modal-${index}`} tabIndex="-1" role="dialog"
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
                        <input type="text" className="form-control"  id={`price-name-${index}`} ref={(input) => { this.price = input; }} />
                      </div>
                      <div className="form-group">
                        <h5 style={{ color: 'black', textAlign: 'left'}} key={'sheet' + index} htmlFor={`sheet-name-${index}`} className="col-form-label">賣出張數:</h5>
                        <input type="text" className="form-control" id={`sheet-name-${index}`}  ref={(input) => { this.sheet = input; }}/>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary"  data-dismiss="modal" aria-label="Close"onClick={ this.updateStockStatus}>確認{stock.name}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>}
          {  (route ==='Taiwan_account'  && isMerge === false && stock.status === 'sale') && <td>{stock.sale_date}</td>}
          {  (route ==='Taiwan_account'  && isMerge === false && stock.status === 'unsale')  && <td>{stock.date}</td>}
          { route !=='Taiwan_account' && isMerge === false &&(saleStatus === 'all' || saleStatus === 'sale') && (stock.status === 'sale' ? <td>{stock.sale_date}</td> : <td></td>)}
          { route !=='Taiwan_account' && isMerge === false &&(saleStatus === 'all' || saleStatus === 'unsale') && (stock.status === 'unsale' ? <td>{stock.date}</td>: <td>{stock.date}</td>)}
          <td>{stock.name}</td>
          <td>{stock.number}</td>
          <td>{isMerge ? (averagePrice / (stock.sheet)).toFixed(2) : averagePrice }</td>
          <td>{this.isFloat(stock.sheet) ? parseFloat(stock.sheet).toFixed(3) : stock.sheet}</td>
          <td>{isMerge ? parseFloat(stock.cost - averagePrice * 1000).toFixed(0) : Math.floor(handlingFee)}</td>
          <td>{Math.floor(stock.cost)}</td>
          <td>{stock.status === "unsale" ? '未賣出' : '已賣出'}</td>
          <td>{Math.floor(stock.sale_cost)}</td>
          <td style={{ 'color': stock.income < 0 ? '#30ff30' : 'rgb(255 19 19)'}}>{Math.floor(stock.income)}</td>
          { isMerge === false && <td>
            <button type="button" className="btn btn-danger" onClick={this.deleteStock}>刪除</button>
          </td> }
        </tr>
    )
  }
}
