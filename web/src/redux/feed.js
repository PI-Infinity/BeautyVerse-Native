import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openedFeed: null,
};

export const Feed = createSlice({
  name: "Feed",
  initialState,

  reducers: {
    setOpenedFeed: (state, action) => {
      state.openedFeed = action.payload;
    },
  },
});

export const { setOpenedFeed } = Feed.actions;
export default Feed.reducer;
