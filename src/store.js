import { configureStore } from '@reduxjs/toolkit'
import mutualStateReducer from './slices/mutualState'
import apiDataReducer from './slices/apiDataSlice'
import { combineReducers } from 'redux'

const reducers = combineReducers({
    mutualStateReducer,
    apiDataReducer
})
const store = configureStore({
    reducer: reducers,
})

export default store