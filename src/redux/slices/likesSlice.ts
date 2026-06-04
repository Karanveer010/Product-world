import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LikesState {
  likedIds: string[];
}

const initialState: LikesState = {
  likedIds: [],
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    toggleLike(state, action: PayloadAction<string | number>) {
      const id = String(action.payload);
      const index = state.likedIds.indexOf(id);
      if (index > -1) {
        state.likedIds.splice(index, 1);
      } else {
        state.likedIds.push(id);
      }
    },
    clearLikes(state) {
      state.likedIds = [];
    },
  },
});

export const { toggleLike, clearLikes } = likesSlice.actions;
export default likesSlice.reducer;
