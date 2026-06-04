import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
}

interface UserState {
  profile: UserProfile | null;
  isGuest: boolean;
  ordersCount: number;
}

const initialState: UserState = {
  profile: null,
  isGuest: true,
  ordersCount: 0,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    fetchUserSuccess(state, action: PayloadAction<any>) {
      state.profile = action.payload;
      state.isGuest = false;
    },
    setGuestUser(state) {
      state.profile = null;
      state.isGuest = true;
    },
    signOutSuccess(state) {
      state.profile = null;
      state.isGuest = true;
    },
    incrementOrdersCount(state) {
      if (typeof state.ordersCount !== "number" || isNaN(state.ordersCount)) {
        state.ordersCount = 0;
      }
      state.ordersCount += 1;
    },
    resetUserData(state) {
      state.profile = null;
      state.isGuest = true;
      state.ordersCount = 0;
    },
  },
});

export const { fetchUserSuccess, setGuestUser, signOutSuccess, incrementOrdersCount, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
