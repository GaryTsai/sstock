import React, { useState } from 'react';
import Radium from "radium";
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";

import settings from '../../settings'
import utils from '../../utils/dateFormat'
import { changeLoginStatus } from '../../slices/mutualState';
import './style.css'

const initialState = {
  email:'',
  resetEmail:'',
  password:'',
  isLogIn: true,
  error: false,
  message: '',
  isOpenForgetPWD: false
};

const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState(initialState)
  const { t } = useTranslation()
  const logInSelect = status => setLoginInfo({...loginInfo, isOpenForgetPWD: false,isLogIn: status});

  const actionForSubmit = () =>{
    const {email, password ,isLogIn} = loginInfo;

    switch (isLogIn) {
      case true:
        return logInSubmit(email, password);
      case false:
        return registerSubmit(email, password);
      default:
        return {}
    }
  };

  const logInSubmit = (email, password) =>{
    const { logInCallBack } = props;
    if(!email && !password ){
      setLoginInfo({...loginInfo, error:true, message: t("enterAccountWarning")});
      setTimeout(() => setLoginInfo({...loginInfo, error:false, message: ''}), 5000)
      return ;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        var user = firebase.auth().currentUser;

        if(user){
          localStorage.setItem('account-stock', user.uid);
          console.log('log in successfully');
          settings.user_id = user.uid;
          setLoginInfo({...loginInfo, email: '', password: ''})
          logInCallBack && logInCallBack(user.uid);
          dispatch(changeLoginStatus())
          navigate('/sstock')
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'warning',
          title: t("alertWarning"),
          text: error.message.toString()
        })
        
        setLoginInfo({...loginInfo, error:true, message: error.message})
        setTimeout(() => setLoginInfo({...loginInfo, error:false, message: ''}), 5000);
        return ;
      });
  };

  const registerSubmit = (email, password) =>{
    const {logInCallBack, homePageCallBack} = props;
    if(!email && !password ){
      setLoginInfo({...loginInfo, error:true, message: t('enterAccountWarning')});
      setTimeout(() => setLoginInfo({...loginInfo, error: false, message: ''}), 5000);
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
          tw : {
            account_summary : {
              accountMoney : 0,
              accountStock : 0,
              accountTime : utils.dateFormat(new Date()),
              summary : 0
            },
            account_record : {},
            stock_info :{}
          },
          us : {
            account_summary : {
              accountMoney : 0,
              accountStock : 0,
              accountTime : utils.dateFormat(new Date()),
              summary : 0
            },
            account_record : {},
            stock_info : {}
          }
        }).then(() => {
          // 儲存成功後顯示訊息
          localStorage.setItem('account-sstock', u.user.uid);
          console.log('register successfully');
          logInCallBack&&logInCallBack(u.user.uid);
          homePageCallBack&&homePageCallBack();
        });
      }).catch(error => {
      // 註冊失敗時顯示錯誤訊息
      setLoginInfo({...loginInfo, exist: true, error:true, message: error.message.toString()});
      Swal.fire({
        icon: 'warning',
        title: t("alertWarning"),
        text: error.message.toString()
      })
      console.log('register failed');
      return ;
    });
  }

  const setEmail = email => setLoginInfo({...loginInfo, email});

  const setPassword = password =>  setLoginInfo({...loginInfo, password});

  const openForgetPWD = () => setLoginInfo({...loginInfo, isOpenForgetPWD: true});

  const closeForgetPWD = () => setLoginInfo({...loginInfo, isOpenForgetPWD: false});

  const resetPWD = () =>{
    const { resetEmail } = loginInfo;
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(resetEmail).then(function() {
      Swal.fire({
        icon: 'warning',
        title: t("alertWarning"),
        text: t("resetPassword")
      })
      closeForgetPWD();
    }).catch(function(error) {
      Swal.fire({
        icon: 'warning',
        title: t("alertWarning"),
        text: error.message
      })
    });
  };

  const setResetEmail = (email) => setLoginInfo({...loginInfo, resetEmail: email})
  const {isLogIn, isOpenForgetPWD} = loginInfo;

  return (
      <div className="wrapper">
        <div className="fadeInDown login-fadeInDown">
          <div key='logIn' className="selected logIn" style={{border: isLogIn ? '3px solid white' : ''}} onClick={() => logInSelect(true)}>{t('login.login')}</div>
          <div key='register' className="selected register" style={{border: isLogIn ? '' : '3px solid white' }} onClick={() => logInSelect(false)}>{t('login.register')}</div>
        </div>
      <div className="fadeInDown frame-content"  style={{ border: isLogIn ? '5px' + ' solid #2196f3' : '5px solid rgb(232 88 78)'}}>
        {!isOpenForgetPWD && <div>
        <div className="fadeIn first">
          <div className="logo"/>
        </div>
        <div className="login-input">
          <input type="text" id="email"  onChange={(c) => setEmail(c.target.value)} className="fadeIn second login-input-content" name="login" placeholder="email"/>
          <input type="password" id="password" onChange={(c) => setPassword(c.target.value)} className="fadeIn third login-input-content" name="login" placeholder={t('login.password')}/>
        </div>
        <input type="submit" className="fadeIn fourth login-submit" value={isLogIn ? t('login.login') : t('login.register') } onClick={actionForSubmit}/>
        { isLogIn && <div id="formFooter" className='forget-PWD'>
            <a className="underlineHover" href="#" onClick={openForgetPWD}>{t("forgotPassword")}</a>
          </div> 
        }
        </div>}
        {isOpenForgetPWD && <div className="input-forgetPWD-content">
          <input type="text" id="email"  onChange={(c) => setResetEmail(c.target.value)} className="fadeIn second login-input-content" name="login" placeholder={t('login.email')}/>
          <input key={'backToLogIn'}  onClick={closeForgetPWD} type="button" className="fadeIn fourth login-forget back" value={'back'}/>
          <input  type="submit" className="fadeIn fourth login-forget submit" value={'submit to mail'} onClick={resetPWD}/>
        </div>}
      </div>
    </div>
  )
}

export default Radium(Login)