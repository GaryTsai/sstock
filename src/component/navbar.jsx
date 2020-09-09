import React, {Component} from 'react';
import browserUtils from './../utils/browserUtils';
const initialState = {
  active: 'all',
};

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
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
        color:'#ed2a2a'
      }
    }else{
      return {
        color:'#ed2a2a'
      }
    }
  };



  render() {
    console.log(this.props.totalCost,this.props.profitAndLoss,this.props.profit,this.props.saleCost);
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-light " style={{backgroundColor: 'rgb(52 149 220)', cursor: 'pointer'}}>
          <a className="navbar-brand"  onClick={e => this.props.changeRoute('home')}>Freedom of wealth</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                  aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <li className={`nav-item`} style={{...this.getActiveStyle()}}>
                <a className="nav-link"  onClick={e => this.props.changeRoute('summary')}>歷史紀錄 <span className="sr-only"></span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" >Yor Money</a>
              </li>
            </ul>
            {/*<form className="form-inline mt-2 mt-md-0">*/}
            {/*  <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>*/}
            {/*    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>*/}
            {/*</form>*/}
          </div>
          <div style={{display: 'inherit'}}>
          {this.props.route === 'summary' && <div style={{fontSize:'18px', fontWeight:'bold',...this.getComputeStyleForMobile()}}>投入成本:{this.props.saleCost}元</div>}
          {this.props.route === 'summary' && <div style={{fontSize:'18px', fontWeight:'bold',...this.getComputeStyleForMobile()}}>總損益: {this.props.profitAndLoss}元</div>}
          {this.props.route === 'summary' && <div style={{fontSize:'18px', fontWeight:'bold',...this.getComputeStyleForMobile()}}>投殖利率: {this.props.profit}%</div>}
            {this.props.route === 'home' && <div style={{width:'100%',fontSize:'18px', fontWeight:'bold',...this.getComputeStyleForMobile()}}>總成本: {this.props.totalCost}元</div>}

          </div>
        </nav>

      </div>
    )
  }
}
