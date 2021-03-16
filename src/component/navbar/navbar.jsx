import React, {Component} from 'react';
import browserUtils from '../../utils/browserUtils';

export default class Navbar extends Component {
  componentDidMount() {
  }

  getActiveStyle = () =>{
    if(browserUtils.isMobile()){
      return {
        fontSize: '16px',
        marginTop: '5px',
        background:'rgb(232 232 232)',
        borderRadius: '10px'
      }
    } else {
      return {
        fontSize: '16px',
        cursor: 'pointer',
        background: 'rgb(232 232 232)',
        borderRadius: '10px'
      }
    }
  };

  getComputeStyleForMobile = () =>{
    if(browserUtils.isMobile()){
      return {
        flexBasis: '100%',
        flexGrow: '1',
        alignItems: 'center',
        color:'#ed2a2a',
        fontSize:'16px',
        fontWeight:'bold'
      }
    }else{
      return {
        color:'#ed2a2a',
        fontSize:'18px',
        fontWeight:'bold'
      }
    }
  };

  render() {
    const {saleCost, profitAndLoss, profit, totalCost ,route, changeRoute} = this.props;

    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-light " style={{backgroundColor: 'rgb(52 149 220)', cursor: 'pointer'}}>
          <div className="navbar-brand"  style={route === 'Taiwan_account' ? {...this.getActiveStyle(), padding: '5px'} : {}}　onClick={e => changeRoute('Taiwan_account')}>台灣股票</div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                  aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <li className={`nav-item`} style={route === 'Taiwan_history' ? this.getActiveStyle() : {}}>
                <div className="nav-link"  onClick={e => changeRoute('Taiwan_history')}>台股歷史紀錄 <span className="sr-only"></span></div>
              </li>
              <li className="nav-item"  style={route === 'US_account' ? this.getActiveStyle() : {}} >
                <div className="nav-link"　style={{color: '#e91e63'}} onClick={e => changeRoute('US_account')} >美股證卷</div>
              </li>
              <li className="nav-item"  style={route === 'account' ? this.getActiveStyle() : {}} >
                <div className="nav-link"　onClick={e => changeRoute('account')} >我的帳戶</div>
              </li>
            </ul>
          </div>
          <div style={{display: 'inherit',...this.getComputeStyleForMobile()}}>
          {(route === 'Taiwan_history' || route === 'US_account') && <div style={{display: 'flex'}}>
          <div>投入成本:{saleCost}元</div>
          <div>總損益: {profitAndLoss}元</div>
          <div>投殖利率: {profit}%</div>
          </div>}
          </div>
          <div style={{display: 'inherit', padding: '5px 0px',...this.getComputeStyleForMobile()}}>
            {(route === 'Taiwan_account' || route === 'US_account') && <div>目前投入總成本: {totalCost}元</div>}
          </div>
        </nav>
      </div>
    )
  }
}
