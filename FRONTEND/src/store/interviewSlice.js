import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import {BACKEND_URL} from "../../../constants.js";

// Create axios instance
const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
});

// Async thunk for generating interview report
export const generateInterviewReport = createAsyncThunk(
    'interview/generateInterviewReport',
    async ({ personName, jobDescription, selfDescription, resume }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("personName", personName);
            formData.append("jobDescription", jobDescription);
            formData.append("selfDescription", selfDescription);
            formData.append("resume", resume);

            const response = await api.post(`/api/interview`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data;
        } catch (error) {
            // Handle different error scenarios
            if (error.response) {
                // Server responded with error
                return rejectWithValue({
                    message: error.response.data?.message || 'Failed to generate interview report',
                    status: error.response.status
                });
            } else if (error.request) {
                // Request made but no response
                return rejectWithValue({
                    message: 'No response from server. Please check your connection.',
                    status: null
                });
            } else {
                // Other errors
                return rejectWithValue({
                    message: error.message || 'An unexpected error occurred',
                    status: null
                });
            }
        }
    }
);

const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        interview: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Pending state
            .addCase(generateInterviewReport.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            // Fulfilled state
            .addCase(generateInterviewReport.fulfilled, (state, action) => {
                state.loading = false;
                state.interview = action.payload;
                state.success = true;
                state.error = null;
            })
            // Rejected state
            .addCase(generateInterviewReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Failed to generate interview report' };
                state.success = false;
                state.interview = null;
            });
    }
});

export const { clearError } = interviewSlice.actions;
export default interviewSlice.reducer;