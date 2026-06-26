import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    adminToken: string | null;
}

const getLocalStorageItem = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    adminToken: getLocalStorageItem("adminToken"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAdmin: (state, action: PayloadAction<AuthState>) => {
            state.adminToken = action.payload.adminToken;
            localStorage.setItem("adminToken", JSON.stringify(action.payload.adminToken));
        },
        logout: (state: AuthState) => {
            state.adminToken = null;
            localStorage.clear();
            window.location.href = "/";
        }
    }
});

export const { setAdmin, logout } = authSlice.actions;
export const selectIsLogin = (state: { auth: AuthState }) => state.auth.adminToken !== null;

export default authSlice.reducer;