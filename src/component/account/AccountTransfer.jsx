import React, {Component} from 'react';
import utils from "../../utils/dateFormat";
import api from "../../api/api";
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
  date: new Date(),
  price: '',
  transferStatus: 'transferIn',
  source: ''
};

export default class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
  }

  inputSource = source => {
    this.setState({
      source
    })
  };

  submitTrade = () => {
    const {price, transferStatus, source} = this.state;
    if (transferStatus && source && !isNaN(price)) {
      let self = this.props;
      const transferInfo = {price: price, transferStatus: transferStatus, source: source};
      api.tradeForAccount(transferInfo).then(() => {
        self.callback();
      });
      this.setState({
        'price': '',
        'source': ''
      });
    } else {
      return alert('不許有任何一個為空');
    }
  };

  getFormatDate = date => {
    const year = date.getFullYear();
    const month = utils.toDualDigit(date.getMonth() + 1);
    const day = utils.toDualDigit(date.getDate());

    return year + '-' + month + '-' + day
  };

  handleChange = (price) => {
    this.setState({price: price});
  };

  getTransferOptions = (e) => this.setState({transferStatus: e.target.value});


  render() {
    return (
      <div style={{margin: '5px 5px'}}>
        <div className="form-row">
          <div className="col">
            <input type="text" className="form-control" placeholder="金額"
                   onChange={(c) => this.handleChange(c.target.value)} value={this.state.price}/>
          </div>
          <div className="from-group col-md-2 input-sale-frame">
            <input type="text" className="form-control" placeholder="來源"
                   onChange={(c) => this.inputSource(c.target.value)} value={this.state.source}/>
          </div>
          <div className="btn-group btn-group-toggle from-group col-md-2" data-toggle="buttons"
               style={{margin: '0px 10px', zIndex: 0}}>
            <label className="btn btn-warning active" onClick={this.getTransferOptions}>
              <input type="radio" name="stockOption" id="individual" value='transferIn' autoComplete="off"/> 轉入
            </label>
            <label className="btn btn-warning" onClick={this.getTransferOptions}>
              <input type="radio" name="stockOption" id="mutual" value='transferOut' autoComplete="off"/> 轉出
            </label>
          </div>
          <button className="btn btn-primary from-group col-md-2 input-sale-frame" type="submit"
                  onClick={this.submitTrade}>確認送出
          </button>
        </div>
      </div>
    )
  }
}
