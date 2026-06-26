import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    token: string | null;
    user: {
        name: string;
        email: string;
    } | null;
    activeNav: string;
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
    token: getLocalStorageItem("token"),
    user: getLocalStorageItem("user"),
    activeNav: "home"
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        activeNav: (state, action: PayloadAction<string>) => {
            state.activeNav = action.payload;
        },
        setUser: (state, action: PayloadAction<AuthState>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        getUser: (state: AuthState) => {
            state.token = getLocalStorageItem("token");
            state.user = getLocalStorageItem("user");
        },
        logout: (state: AuthState) => {
            state.token = null;
            state.user = null;
            localStorage.clear();
        }
    }
});

export const { activeNav, setUser, getUser, logout } = authSlice.actions;
export default authSlice.reducer