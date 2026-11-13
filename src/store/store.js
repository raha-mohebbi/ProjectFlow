import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskSlice from "./taskSlice";
import projectSlice from "./projectSlice"

const store=configureStore({
    reducer:{
        auth:authReducer,
        tasks: taskSlice,
        projects:projectSlice,
    }
})
export default store;