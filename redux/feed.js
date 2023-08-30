import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // feedId: null,
  videoVolume: true,
  // text: "",
  // definedLanguage: null,
  // translateActive: false,
  feedPosts: [],
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
    setFeedPost: (state, action) => {
      const postIndex = state.feedPosts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (postIndex !== -1) {
        // Replace the post at the found index with the new post
        state.feedPosts[postIndex] = action.payload;
      } else {
        // If no post with the same id exists, push the new post to the array
        state.feedPosts.push(action.payload);
      }
    },
    removeFeedPost: (state, action) => {
      console.log("remove: " + action.payload);
      state.feedPosts = state.feedPosts.filter(
        (post) => post.id !== action.payload
      );
    },
  },
});

export const {
  // setFeedId,
  setVideoVolume,
  setFeedPost,
  removeFeedPost,
  // setText,
  // setDefLanguage,
  // setTranslateActive,
} = Feed.actions;
export default Feed.reducer;
