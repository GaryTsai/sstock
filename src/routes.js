import React from "react";
import Stocks from "./components/stocks/stocks";
import Account from "./components/account/account";
import TwChart from "./components/twChart";
import NotFound from "./notFound";
import Login from "./components/login/login";
import WrapLayout from "./wrapLayout";

const routes = [
    {
        path: "/sstock",
        element: <WrapLayout children={<Stocks/>}></WrapLayout>,
        children: [],
    },
    {
        path: "/sstock/login",
        element: <WrapLayout children={<Login/>}></WrapLayout>,
        children: [],
    },
    {
        path: "/sstock/stockHistory",
        element: <WrapLayout children={<Stocks/>}></WrapLayout>,
        children: [],
    },
    {
        path: "/sstock/account",
        element: <WrapLayout children={<Account/>}></WrapLayout>,
        children: [],
    },
    {
        path: "/sstock/chart",
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