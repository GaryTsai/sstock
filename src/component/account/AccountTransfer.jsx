import React, {Component} from 'react';
import browserUtils from "../../utils/browserUtils";
import api from "../../api/api";
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
  date: new Date(),
  price: '',
  transferStatus: 'transferIn',
  source: ''
};

export default class AccountTransfer extends Component {
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
    const {whichAccount} = this.props;
    if (transferStatus && source && !isNaN(price)) {
      let self = this.props;

      const transferInfo = {price: price, transferStatus: transferStatus, source: source};
      console.log(transferInfo, whichAccount);
      api.tradeForAccount(transferInfo, whichAccount).then(() => {
        self.callback(whichAccount);
      });
      this.setState({
        'price': '',
        'source': ''
      });
    } else {
      return alert('不許有任何一個為空');
    }
  };

  getStyleOfButton = () =>{
    if(browserUtils.isMobile()){
      return {
        margin: '4px  0px'
      }
    }else{
      return {
        margin: '0px  0px'
      }
    }
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
               style={{...this.getStyleOfButton()}}>
            <label className="btn btn-warning active" onClick={this.getTransferOptions}>
              <input type="radio" name="stockOption" id="individual" value='transferIn' autoComplete="off"/> 存入
            </label>
            <label className="btn btn-warning" onClick={this.getTransferOptions}>
              <input type="radio" name="stockOption" id="mutual" value='transferOut' autoComplete="off"/> 轉出
            </label>
          </div>
          <button style={{borderRadius: '5px', margin: 'auto 5px'}} className="btn btn-primary from-group col-md-2 input-sale-frame" type="submit"
                  onClick={this.submitTrade}>確認送出
          </button>
        </div>
      </div>
    )
  }
}
