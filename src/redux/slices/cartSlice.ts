import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string | number>) {
      const id = String(action.payload);
      const existing = state.items.find((item) => String(item.id) === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ id, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string | number>) {
      const id = String(action.payload);
      state.items = state.items.filter((item) => String(item.id) !== id);
    },
    updateQuantity(state, action: PayloadAction<{ id: string | number; quantity: number }>) {
      const { id, quantity } = action.payload;
      const idStr = String(id);
      const item = state.items.find((item) => String(item.id) === idStr);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
