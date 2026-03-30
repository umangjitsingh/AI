import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
    const result = await axios.get(`${BACKEND_URL}/api/auth/get-me`, {withCredentials: true});
    console.log("result", result);
    return result.data.user;
})

const authSlice = createSlice({
    name: "AuthSlice",
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
            });

    }
})
export const { logout } = authSlice.actions;
export default authSlice.reducer;

