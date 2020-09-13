import React, {Component} from 'react';
import browserUtils from '../../utils/browserUtils';

export default class Navbar extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  getActiveStyle = () =>{
    if(browserUtils.isMobile() && this.props.route === 'summary'){
      return {
        marginTop: '5px',
        background:'rgb(232 232 232)',
      }
    }
    if(this.props.route === 'summary')
      return {
        cursor: 'pointer',
        background:'rgb(232 232 232)',
        borderRadius: '10px'
      }
  };

  getComputeStyleForMobile = () =>{
    if(browserUtils.isMobile()){
      return {
        flexBasis: '100%',
        flexGrow: '1',
        alignItems: 'center',
        color:'#ed2a2a',
        fontSize:'18px',
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
          <a className="navbar-brand"  onClick={e => changeRoute('home')}>Freedom of wealth</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                  aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <li className={`nav-item`} style={{...this.getActiveStyle()}}>
                <a className="nav-link"  onClick={e => changeRoute('summary')}>歷史紀錄 <span className="sr-only"></span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link"　onClick={e => changeRoute('account')} >我的帳戶</a>
              </li>
            </ul>
          </div>
          <div style={{display: 'inherit',...this.getComputeStyleForMobile()}}>
          {route === 'summary' && <div style={{display: 'flex'}}>
          <div>投入成本:{saleCost}元</div>
          <div>總損益: {profitAndLoss}元</div>
          <div>投殖利率: {profit}%</div>
          </div>}
          {route === 'home' && <div>總成本: {totalCost}元</div>}
          </div>
        </nav>
      </div>
    )
  }
}
