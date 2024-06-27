import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from './../api/api'

export const fetchStock = createAsyncThunk("stock/fetchStock", async() => {
    console.log('-----------fetchStocks-------------');
    const response = await api.getAllData();
    return response;
});

export const fetchRecords = createAsyncThunk("stock/fetchRecord", async() => {
    console.log('-----------fetchRecords-------------');
    const response = await api.getAccountRecord();
    return response;
});

export const fetchAccountSummary = createAsyncThunk("stock/fetchAccountSummary", async() => {
    console.log('-----------fetchAccountSummary-------------');
    const response = await api.getAccount();
    return response;
});

export const fetchStockComment = createAsyncThunk("stock/fetchStockComment", async() => {
    console.log('-----------fetchStockComment-------------');
    const response = await api.getStockComment();
    return response;
});

export const fetchRealtimePrice = createAsyncThunk("stock/fetchRealtimePrice", async(stock_info) => {
    console.log('-----------fetchRealtimePrice-------------');
    const response = await api.getStockRealtimePrice(stock_info);
    return response
});

export const apiDataSlice = createSlice({
    name: "stock",
    initialState: {
        loading: false,
        allStocks: [],
        lastYearROI: "",
        profit: 0,
        profitAndLoss: 0,
        saleCost: 0,
        saleStocks: [],
        unSaleStocks: [],
        showStocks: [],
        totalCost: 0,
        historicalProfitAndLoss: 0,
        records: [],
        recordsLoading: false,
        chartLoading: false,
        acTime: '',
        acMoney: 0,
        acStock: 0,
        acSummary: 0,
        stockComment: '',
        stockRealtimePrice: null,
        stockRealtimePriceStatus: null,
        stockRealtimePriceOffset: null
    },
    reducers: {
        updateQueryData: (state, action) => {
            const updateData = (queryCondition) => {
                const startRegion = queryCondition.dateRegion1;
                const endRegion = queryCondition.dateRegion2;
                let result = '';

                if (queryCondition.stockStatus === 'individual') {
                    switch (queryCondition.saleStatus) {
                        case 'all':
                            result = state.allStocks.filter(a => (startRegion <= a.sale_date || startRegion <= a.date) && (a.date <= endRegion || a.sale_date <= endRegion));
                            break;
                        case 'sale':
                            result = state.saleStocks.filter(a => startRegion <= a.sale_date && a.sale_date <= endRegion);
                            break;
                        case 'unsale':
                            result = state.unSaleStocks.filter(a => startRegion <= a.date && a.date <= endRegion);
                            break;
                        default:
                            break;
                    }
                    return result
                } else if (queryCondition.stockStatus === 'mutual') {}
            };
            const updateHistoricalProfitAndLoss = (stocks) => {
                let calculation = 0;
                for (let stock in stocks) {
                    calculation += stocks[stock].status === "sale" ? stocks[stock].income : 0;
                }
                return calculation
            }
            state.showStocks = updateData(action.payload)
            state.historicalProfitAndLoss = updateHistoricalProfitAndLoss(state.showStocks)
        }
    },
    extraReducers: {
        //fetchStock
        [fetchStock.pending]: (state) => {
            state.loading = true;
            state.chartLoading = true;
        },

        [fetchStock.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.chartLoading = false;
            state.allStocks = payload.allStocks;
            state.lastYearROI = payload.lastYearROI;
            state.profit = payload.profit;
            state.profitAndLoss = payload.profitAndLoss;
            state.saleCost = payload.saleCost;
            state.saleStocks = payload.saleStocks;
            state.unSaleStocks = payload.unSaleStocks;
            state.showStocks = payload.showStocks;
            state.totalCost = payload.totalCost;
            state.historicalProfitAndLoss = payload.historicalProfitAndLoss; 
        },
        [fetchStock.rejected]: (state) => {
            state.loading = false;
            state.chartLoading = false;
        },
        //fetchRecords
        [fetchRecords.pending]: (state) => {
            state.recordsLoading = true;
        },
        [fetchRecords.fulfilled]: (state, { payload }) => {
            state.records = payload;
            state.recordsLoading = false;
        },

        [fetchRecords.rejected]: (state) => {
            state.loading = false;
        },
        //fetchAccountSummary
        [fetchAccountSummary.pending]: (state) => {},
        [fetchAccountSummary.fulfilled]: (state, { payload }) => {
            state.acTime = payload.accountTime
            state.acMoney = payload.accountMoney
            state.acStock = payload.accountStock
            state.acSummary = payload.summary
        },
        [fetchAccountSummary.rejected]: (state) => {},
        //fetchStockComment
        [fetchStockComment.pending]: (state) => {},
        [fetchStockComment.fulfilled]: (state, { payload }) => {
            state.stockComment = payload.stockComment ? payload.stockComment : state.stockComment
        },

        [fetchStockComment.rejected]: (state) => {},
        //fetchRealtimePrice
        [fetchRealtimePrice.pending]: (state) => {
            state.stockRealtimePriceStatus = false
        },
        [fetchRealtimePrice.fulfilled]: (state, { payload }) => {
            state.stockRealtimePrice = payload.priceData
            state.stockRealtimePriceOffset = payload.priceOffset
            state.stockRealtimePriceStatus = true
        },

        [fetchRealtimePrice.rejected]: (state) => {}
    }
});
export const { updateQueryData } = apiDataSlice.actions

export default apiDataSlice.reducer;