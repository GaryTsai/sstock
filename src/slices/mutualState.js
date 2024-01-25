import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initLoading: false,
    contentLoading: false,
    isMerge: false,
    logInStatus: false,
    queryStatus: 'all',
    isStocksDetail: false,
    stocksDetailNumber: null
}
export const mutualStateSlice = createSlice({
    name: 'mutualState',
    initialState,
    reducers: {
        changeContentLoading: (state, action) => {
            state.contentLoading = action.payload
        },
        changeInitLoading: (state,action) => {
            state.initLoading = action.payload
        },
        changeStockMergeState: (state) => {
            state.isMerge = !state.isMerge
        },
        changeLoginStatus: (state) => {
            state.logInStatus = !state.logInStatus
        },
        changeQueryStatus: (state, action) => {
            state.queryStatus = action.payload
        },
        changeStocksDetail: (state, action) => {
            state.isStocksDetail = !state.isStocksDetail
        },
        showStocksDetail: (state, action) => {
            state.stocksDetailNumber = action.payload
        },
    }

})

export const { changeInitLoading, changeContentLoading, changeStockMergeState, changeLoginStatus, changeQueryStatus, changeStocksDetail, showStocksDetail} = mutualStateSlice.actions

export default mutualStateSlice.reducer