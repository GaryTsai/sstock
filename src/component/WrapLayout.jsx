import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Navbar from './navbar/navbar'

const WrapLayout = ({children}) => {
    const navigate = useNavigate()
    const account = localStorage.getItem('account-stock');
    const { initLoading } = useSelector(state => state.mutualStateReducer)
    const location = useLocation()
    useEffect(() => {
        if(!account) {
            navigate('/sstock/login')
        } else if (location.pathname === '/sstock/login') {
            navigate('/sstock')
        }
    },[account])

    return (
        <div>
            {initLoading === true &&<div className="loading-image-frame">
                <img  alt="" className='loading-image'src={require('./../assets/img/loading.gif')}/></div>}
            { account && <Navbar/>}
            {children}
        </div>
    )
}

export default WrapLayout