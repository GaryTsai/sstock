import React, {Component} from 'react';
import browserUtils from '../../utils/browserUtils';
import styles from './style';
export default class Navbar extends Component {
  componentDidMount() {}

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
    const {saleCost, profitAndLoss, profit, totalCost ,route, changeRoute, logOutCallBack, lastYearROI} = this.props;
    const isMobile = browserUtils.isMobile();

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
              <li className={`nav-item`} data-toggle="collapse" data-target=".navbar-collapse.show" style={route === 'Taiwan_history' ? this.getActiveStyle() : {}}>
                <div className="nav-link"  onClick={e => changeRoute('Taiwan_history')}>台股歷史紀錄 <span className="sr-only"></span></div>
              </li>
              <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show" style={route === 'US_account' ? this.getActiveStyle() : {}} >
                <div className="nav-link"　style={{color: '#e91e63'}} onClick={e => changeRoute('US_account')} >美股證卷</div>
              </li>
              <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show" style={route === 'account' ? this.getActiveStyle() : {}} >
                <div className="nav-link"　onClick={e => changeRoute('account')} >我的帳戶</div>
              </li>
              {isMobile &&<li className="nav-item"  data-toggle="collapse" data-target=".navbar-collapse.show" style={{marginTop: '5px'}}>
                <div className="nav-link"　style={styles.logOutButtonMobile} onClick={() => logOutCallBack()} >登出</div>
              </li>}
            </ul>
          </div>
          <div style={{display: 'inherit',...this.getComputeStyleForMobile()}}>
          {(route === 'Taiwan_history' || route === 'US_account') && <div style={isMobile ?　styles.reportMobile : styles.report}>
          <div style={isMobile ?　styles.reportFormatMobile : styles.reportFormat}><div>投入成本:</div><div>{saleCost.toFixed(2)}元</div></div>
          <div style={isMobile ?　styles.reportFormatMobile : styles.reportFormat}><div>總損益:</div> <div>{profitAndLoss.toFixed(2)}元</div></div>
          <div style={isMobile ?　styles.reportFormatMobile : styles.reportFormat}><div>投報率:</div> <div>{profit}%</div></div>
          <div style={isMobile ?　styles.reportFormatMobile : styles.reportFormat}><div>去年投報率:</div> <div>{lastYearROI}%</div></div>
          </div>}
          </div>
          <div style={{ padding: '5px 0px',...this.getComputeStyleForMobile()}}>
            {(route === 'Taiwan_account' || route === 'US_account') && <div style={isMobile ?　styles.reportFormatMobile : styles.reportFormat}><div>目前投入總成本:</div><div> {totalCost.toFixed(2)}元</div></div>}
          </div>
          {!isMobile && <div style={styles.logOutButton} onClick={() => logOutCallBack()}>登出</div>}
        </nav>
      </div>
    )
  }
}
