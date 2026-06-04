import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FurnitureItem {
  id: string | number;
  title: string;
  price: number;
  rating: number;
  image?: string;
  thumbnail?: string;
  images?: string[];
  category: string;
  date?: string;
  description?: string;
  brand?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  [key: string]: any;
}

interface FurnitureState {
  items: FurnitureItem[];
  total: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  viewMode: "grid" | "list";
  onboardingCompleted: boolean;
}

const initialState: FurnitureState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  searchQuery: "",
  viewMode: "grid",
  onboardingCompleted: false,
};

const furnitureSlice = createSlice({
  name: "furniture",
  initialState,
  reducers: {
    setFurnitureItems(
      state,
      action: PayloadAction<{ items: FurnitureItem[]; total: number; skip: number }>
    ) {
      const { items, total, skip } = action.payload;
      const verifiedItems = Array.isArray(items) ? items : [];
      if (skip === 0) {
        state.items = verifiedItems;
      } else {
        const existingIds = new Set(state.items.map(item => String(item.id)));
        const newItems = verifiedItems.filter(item => !existingIds.has(String(item.id)));
        state.items = [...state.items, ...newItems];
      }
      state.total = total || 0;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    toggleViewMode(state) {
      state.viewMode = state.viewMode === "grid" ? "list" : "grid";
    },
    completeOnboarding(state) {
      state.onboardingCompleted = true;
    },
    resetOnboarding(state) {
      state.onboardingCompleted = false;
    },
  },
});

export const {
  setFurnitureItems,
  setLoading,
  setError,
  setSearchQuery,
  toggleViewMode,
  completeOnboarding,
  resetOnboarding,
} = furnitureSlice.actions;

export default furnitureSlice.reducer;
