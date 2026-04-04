import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./AuthSlice.js";
import interviewReducer from "./InterviewSlice.js";

const store= configureStore({
    reducer: {
        auth: authReducer,
        interview: interviewReducer,
    }
})

export default store;