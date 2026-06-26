import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from '../Api/cartApi'

export interface CartState {
    cart: CartItem[];
}

const initialState: CartState = {
    cart: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartItem[]>) => {
            state.cart = action.payload;
            localStorage.setItem("cart", JSON.stringify(action.payload));
        },
        AddToCart: (state, action: PayloadAction<CartItem>) => {
            state.cart.push(action.payload);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        increaseCartQuantity: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.map((item) => item._id === action.payload ? { ...item, quantity: item.quantity + 1 } : item);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        decreaseCartQuantity: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.map((item) => item._id === action.payload ? { ...item, quantity: item.quantity - 1 } : item);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter((item) => item._id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        clearCart: (state: CartState) => {
            state.cart = [];
            localStorage.removeItem("cart");
        }
    }
});

export const { setCart, AddToCart, increaseCartQuantity, decreaseCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;