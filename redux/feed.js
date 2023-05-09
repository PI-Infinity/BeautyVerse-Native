import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoVolume: true,
};

export const Feed = createSlice({
  name: "Feed",
  initialState,

  reducers: {
    setVideoVolume: (state, action) => {
      state.videoVolume = action.payload;
    },
  },
});

export const { setVideoVolume } = Feed.actions;
export default Feed.reducer;
