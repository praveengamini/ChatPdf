import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/index.js'
import pdfChatReducer  from './home/index.js'
const store = configureStore({
    reducer:{
        auth:authReducer,
        pdfChat: pdfChatReducer
    }
})
export default store