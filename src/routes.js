import React from "react";
import Stocks from "./component/stocks/stocks";
import Account from "./component/account/account";
import TwChart from "./component/twChart";
import NotFound from "./component/NotFound";
import Login from "./component/login/login";
import WrapLayout from "./component/WrapLayout";

const routes = [
    {
        path: "/",
        element: <WrapLayout children={<Stocks/>}></WrapLayout>,
        children: [],
    },
    {
        path: "/login",
        element: <Login/>,
        children: [],
    },
    {
        path: "/stockHistory",
        element: <WrapLayout children={<Stocks/>}></WrapLayout>,
        children: [],
    },
    {
        path: "/account",
        element: <WrapLayout children={<Account/>}></WrapLayout>,
        children: [],
    },
    {
        path: "/chart",
        element: <WrapLayout children={<TwChart/>}></WrapLayout>,
        children: [],
    },
    {
        path: "*",
        element: <WrapLayout><NotFound /></WrapLayout>,
        children: [],
    },
];

export default routes