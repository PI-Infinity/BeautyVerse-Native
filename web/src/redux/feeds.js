import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  page: 1,
  feeds: [],
  followingsFeeds: [],
  followingsPage: 1,
  scrollY: 0,
  rerenderFeeds: false,
};

export const Feeds = createSlice({
  name: "Feeds",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setFeeds: (state, action) => {
      state.feeds = action.payload;
    },
    AddFeeds: (state, action) => {
      const newFeeds = action.payload;
      state.feeds = newFeeds.reduce(
        (acc, curr) => {
          const existingFeedIndex = acc.findIndex(
            (feed) => feed._id === curr._id
          );

          if (existingFeedIndex !== -1) {
            // Feed already exists, merge the data
            acc[existingFeedIndex] = { ...acc[existingFeedIndex], ...curr };
          } else {
            // Feed doesn't exist, add to the array
            acc.push(curr);
          }

          return acc;
        },
        [...state.feeds]
      );
    },
    setFollowingsPage: (state, action) => {
      state.followingsPage = action.payload;
    },
    setFollowingsFeeds: (state, action) => {
      state.followingsFeeds = action.payload;
    },
    AddFollowingsFeeds: (state, action) => {
      const newFeeds = action.payload;
      state.followingsFeeds = newFeeds.reduce(
        (acc, curr) => {
          const existingFeedIndex = acc.findIndex(
            (feed) => feed._id === curr._id
          );

          if (existingFeedIndex !== -1) {
            // Feed already exists, merge the data
            acc[existingFeedIndex] = { ...acc[existingFeedIndex], ...curr };
          } else {
            // Feed doesn't exist, add to the array
            acc.push(curr);
          }

          return acc;
        },
        [...state.followingsFeeds]
      );
    },
    setScrollYFeeds: (state, action) => {
      state.scrollY = action.payload;
    },
    setRerenderFeeds: (state, action) => {
      state.rerenderFeeds = !state.rerenderFeeds;
    },
  },
});

export const {
  setLoading,
  setPage,
  setFeeds,
  AddFeeds,
  setFollowingsFeeds,
  AddFollowingsFeeds,
  setScrollYFeeds,
  setRerenderFeeds,
} = Feeds.actions;
export default Feeds.reducer;
