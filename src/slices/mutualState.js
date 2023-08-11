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
}
export const mutualStateSlice = createSlice({
    name: 'mutualState',
    initialState,
    reducers: {
        changeContentLoading: (state,action) => {
            state.contentLoading = action.payload
        },
        changeLoading: (state,action) => {
            state.loading = action.payload
        },
        changeStockMergeState: (state) => {
            state.isMerge = !state.isMerge
        },
        changeLoginStatus: (state) => {
            state.logInStatus = !state.logInStatus
        }
    }

})

export const { changeLoading, changeContentLoading, changeStockMergeState, changeLoginStatus} = mutualStateSlice.actions

export default mutualStateSlice.reducer