import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // feedId: null,
  videoVolume: true,
  // text: "",
  // definedLanguage: null,
  // translateActive: false,
};

export const Feed = createSlice({
  name: "Feed",
  initialState,

  reducers: {
    // setFeedId: (state, action) => {
    //   state.feedId = action.payload;
    // },
    setVideoVolume: (state, action) => {
      state.videoVolume = action.payload;
    },
    // setText: (state, action) => {
    //   state.text = action.payload;
    // },
    // setDefLanguage: (state, action) => {
    //   state.definedLanguage = action.payload;
    // },
    // setTranslateActive: (state, action) => {
    //   state.translateActive = action.payload;
    // },
  },
});

export const {
  // setFeedId,
  setVideoVolume,
  // setText,
  // setDefLanguage,
  // setTranslateActive,
} = Feed.actions;
export default Feed.reducer;
