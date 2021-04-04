import React, {Component} from 'react';
import Radium from "radium";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import "firebase/database";
// Add the Firebase products that you want to use
import styles from './styles'
import settings from './../settings/settings'
import utils from './../../utils/dateFormat'
const initialState = {
  email:'',
  resetEmail:'',
  password:'',
  isLogIn: true,
  error: false,
  message: '',
  isOpenForgetPWD: false
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  componentWillUnmount() {
    window.document.removeEventListener('keydown', (function(e) {
      if( e.keyCode === 13 ) this.loginSubmitWithKeydown();
    }).bind(this));
  }

  componentDidMount() {
    window.document.addEventListener('keydown', (function(e) {
      if( e.keyCode === 13 ) this.loginSubmitWithKeydown();
    }).bind(this));
  }

  loginSubmitWithKeydown =() => this.getStatusMethod();

  getStatusMethod = ()=>{
    return this.actionForSubmit(this.state.email, this.state.password);
  }

  logInSelect = status => this.setState({isOpenForgetPWD: false,isLogIn: status});

  actionForSubmit = () =>{
    const {email, password ,isLogIn} = this.state;
    const self = this;
    switch (isLogIn) {
      case true:
        return self.logInSubmit(email, password);
      case false:
        return self.registerSubmit(email, password);
    }
  };

  logInSubmit = (email, password) =>{
    const {logInCallBack, homePageCallBack} = this.props;
    if(!email && !password ){
      this.setState({error:true, message:'Please input email&password'});
      setTimeout(() =>this.setState({error:false, message: ''}), 5000)
      return ;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        var user = firebase.auth().currentUser;

        if(user){
          localStorage.setItem('account', user.uid);
          console.log('log in successfully');
          settings.user_id = user.uid;
          logInCallBack&&logInCallBack(user.uid);
          homePageCallBack&&homePageCallBack();
        }
      })
      .catch((error) => {
        window.alert(error.message.toString())
        this.setState({error:true, message: error.message})
        setTimeout(() =>this.setState({error:false, message: ''}), 5000);
        return ;
      });
  };

  registerSubmit = (email, password) =>{
    const {logInCallBack, homePageCallBack} = this.props;
    if(!email && !password ){
      this.setState({error:true, message:'Please input email&password'});
      setTimeout(() =>this.setState({error: false, message: ''}), 5000);
      return ;
    }
    let user = {
      email: email,
      pwd: password
    };
    firebase.auth().createUserWithEmailAndPassword(user.email, user.pwd)
      .then(u => {
        settings.user_id = u.user.uid;
        firebase.database().ref(`/account_data/${u.user.uid}`).set({
          "tw" : {
            "account_summary" : {
              "accountMoney" : 0,
              "accountStock" : 0,
              "accountTime" : utils.dateFormat(new Date()),
              "summary" : 0
            },
            "account_record" : {},
            "stock_info" :{}
          },
          "us" : {
            "account_summary" : {
              "accountMoney" : 0,
              "accountStock" : 0,
              "accountTime" : utils.dateFormat(new Date()),
              "summary" : 0
            },
            "account_record" : {},
            "stock_info" : {}
          }
        }).then(() => {
          // 儲存成功後顯示訊息
          localStorage.setItem('account', u.user.uid);
          console.log('register successfully');
          logInCallBack&&logInCallBack(u.user.uid);
          homePageCallBack&&homePageCallBack();
        });
      }).catch(error => {
      // 註冊失敗時顯示錯誤訊息
      this.setState({exist: true, error:true, message: error.message.toString()});
      window.alert(error.message.toString())
      console.log('register failed');
      return ;
    });
  }

  setEmail = email => this.setState({email:email});

  setPassword = password => this.setState({password:password});

  openForgetPWD = () => this.setState({isOpenForgetPWD: true});

  closeForgetPWD = () => this.setState({isOpenForgetPWD: false});

  resetPWD = () =>{
    const {resetEmail} = this.state;
    const self = this;
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(resetEmail).then(function() {
      window.alert('已發送信件至信箱，請按照信件說明重設密碼');
      self.closeForgetPWD();
    }).catch(function(error) {
      window.alert(error.message)
    });
  };

  setResetEmail = (email) => this.setState({resetEmail: email})

  render() {
    const {isLogIn, isOpenForgetPWD} = this.state;

    return (
        <div style={styles.wrapper} >
          <div className="fadeInDown"  style={{ width: '40%', display: 'flex', position: 'fixed', top: '5%'}}>
            <div key='logIn' style={{...styles.logIn, border: isLogIn ? '3px solid white' : ''}} onClick={() => this.logInSelect(true)}>登入</div>
            <div key='register' style={{...styles.register, border: isLogIn ? '' : '3px solid white' }} onClick={() => this.logInSelect(false)}>註冊</div>
          </div>
        <div className="fadeInDown"  style={{...styles.frameContent, border: isLogIn ? '5px' +
            ' solid #2196f3' : '5px solid rgb(232 88 78)'}}>
          {!isOpenForgetPWD && <div>
          <div className="fadeIn first">
            <div style={{...styles.logo, backgroundImage: 'url(' + require('./../../assets/img/logo.png') + ')'}}/>
          </div>
          <div style={{...styles.inputContent}}>
            <input type="text" style={styles.input} id="email"  onChange={(c) => this.setEmail(c.target.value)} className="fadeIn second" name="login" placeholder="email"/>
            <input type="text" style={styles.input} id="password" onChange={(c) => this.setPassword(c.target.value)} className="fadeIn third" name="login" placeholder="password"/>
          </div>
          <input style={{...styles.submit}}  type="submit" className="fadeIn fourth"
                 value={isLogIn ? 'Log In' : 'Register' } onClick={this.actionForSubmit}/>
          {isLogIn && <div id="formFooter"  style={styles.forgetPWD} >
            <a className="underlineHover" href="#" onClick={this.openForgetPWD} >Forgot Password?</a>
          </div>}
          </div>}
          {isOpenForgetPWD &&
          <div style={{...styles.inputContent}}>
            <input type="text" style={styles.input} id="email"  onChange={(c) => this.setResetEmail(c.target.value)} className="fadeIn second" name="login" placeholder="email"/>
            <input key={'backToLogIn'} style={{...styles.back, margin: '5px', width: '40%'}}  onClick={this.closeForgetPWD} type="button" className="fadeIn fourth"
                   value={'back'}/>
            <input style={{...styles.submit, width: '40%'}}  type="submit" className="fadeIn fourth"
                   value={'submit to mail'} onClick={this.resetPWD}/>
          </div>}
        </div>
      </div>
    )
  }
}

export default Radium(Login)