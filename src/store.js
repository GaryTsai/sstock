import { configureStore } from '@reduxjs/toolkit'
import mutualStateReducer from './slices/mutualState'
import { combineReducers } from 'redux'

const reducers = combineReducers({
    mutualStateReducer,
    // [todoApiService.reducerPath]: todoApiService.reducer//透過createApi 創建的reducer
})
const store = configureStore({
    reducer: reducers,
})

export default store