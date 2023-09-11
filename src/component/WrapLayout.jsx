import React from 'react'
import Navbar from './navbar/navbar'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const WrapLayout = ({children}) => {
    const navigate = useNavigate()
    const account = localStorage.getItem('account-stock');
    const { initLoading } = useSelector(state => state.mutualStateReducer)
    useEffect(() => {
        if(!account) {
            navigate('/login')
        }
    },[])

    return (
        <div>
            {initLoading === true &&<div style={{position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'block',
            zIndex: 7,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'}}><img  alt="" style={{display:'flex',
            width: '128px',
            height: '128px',
            position: 'relative',
            margin: '0px auto',
            backgroundSize: '100%',
            top: 'calc(50% - 50px)'
            }} src={require('./../assets/img/loading.gif')}/></div>}
            { account && <Navbar/>}
            {children}
        </div>
    )
}

export default WrapLayout