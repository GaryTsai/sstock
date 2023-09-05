import { createSlice } from "@reduxjs/toolkit";
// interface initialState {
//     loading: Boolean,
//     contentLoading: Boolean,
// }
const initialState = {
    loading: false,
    contentLoading: false,
    isMerge: false,
    logInStatus: false,
    queryStatus: 'all'
}
export const mutualStateSlice = createSlice({
    name: 'mutualState',
    initialState,
    reducers: {
        changeContentLoading: (state, action) => {
            state.contentLoading = action.payload
        },
        changeLoading: (state,action) => {
            console.log('action.payload',action.payload)
            state.loading = action.payload
        },
        changeStockMergeState: (state) => {
            state.isMerge = !state.isMerge
        },
        changeLoginStatus: (state) => {
            state.logInStatus = !state.logInStatus
        },
        changeQueryStatus: (state, action) => {
            state.queryStatus = action.payload
        }
    }

})

export const { changeLoading, changeContentLoading, changeStockMergeState, changeLoginStatus, changeQueryStatus} = mutualStateSlice.actions

export default mutualStateSlice.reducer