import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rerenderCurrentUser: false,
  rerenderUserList: false,
  refresh: false,
  cleanUp: false,
  // actions from scroll gallery
  addStarRerenderFromScrollGallery: false,
  removeStarRerenderFromScrollGallery: false,
  addReviewQntRerenderFromScrollGallery: false,
  removeReviewQntRerenderFromScrollGallery: false,
  saveFromScrollGallery: false,
  unsaveFromScrollGallery: false,

  rerenderUserFeeds: false,
  rerenderUserFeed: false,

  rerenderNotifications: false,

  rerenderBookings: false,

  // refreshes
  feedRefreshControl: false,
  cardRefreshControl: false,
};

export const Rerenders = createSlice({
  name: "Rerenders",
  initialState,

  reducers: {
    setRerenderCurrentUser: (state, action) => {
      state.rerenderCurrentUser = !state.rerenderCurrentUser;
    },
    setRerenderUserList: (state, action) => {
      state.rerenderUserList = !state.rerenderUserList;
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
    setCleanUp: (state, action) => {
      state.cleanUp = !state.cleanUp;
    },
    setRerenderUserFeeds: (state, action) => {
      state.rerenderUserFeeds = !state.rerenderUserFeeds;
    },
    setRerenderUserFeed: (state, action) => {
      state.rerenderUserFeed = !state.rerenderUserFeed;
    },
    setAddStarRerenderFromScrollGallery: (state, action) => {
      state.addStarRerenderFromScrollGallery =
        !state.addStarRerenderFromScrollGallery;
    },
    setRemoveStarRerenderFromScrollGallery: (state, action) => {
      state.removeStarRerenderFromScrollGallery =
        !state.removeStarRerenderFromScrollGallery;
    },
    setAddReviewQntRerenderFromScrollGallery: (state, action) => {
      state.addReviewQntRerenderFromScrollGallery =
        !state.addReviewQntRerenderFromScrollGallery;
    },
    setRemoveReviewQntRerenderFromScrollGallery: (state, action) => {
      state.removeReviewQntRerenderFromScrollGallery =
        !state.removeReviewQntRerenderFromScrollGallery;
    },
    setSaveFromScrollGallery: (state, action) => {
      state.saveFromScrollGallery = !state.saveFromScrollGallery;
    },
    setUnsaveFromScrollGallery: (state, action) => {
      state.unsaveFromScrollGallery = !state.unsaveFromScrollGallery;
    },
    setRerenderNotifcations: (state, action) => {
      state.rerenderNotifications = !state.rerenderNotifications;
    },
    setRerenderBookings: (state, action) => {
      state.rerenderBookings = !state.rerenderBookings;
    },
    setFeedRefreshControl: (state, action) => {
      state.feedRefreshControl = action.payload;
    },
    setCardRefreshControl: (state, action) => {
      state.cardRefreshControl = action.payload;
    },
  },
});

export const {
  setRerenderCurrentUser,
  setRerenderUserList,
  setRefresh,
  setCleanUp,
  setRerenderUserFeeds,
  setRerenderUserFeed,
  setAddStarRerenderFromScrollGallery,
  setRemoveStarRerenderFromScrollGallery,
  setAddReviewQntRerenderFromScrollGallery,
  setRemoveReviewQntRerenderFromScrollGallery,
  setSaveFromScrollGallery,
  setUnsaveFromScrollGallery,
  setRerenderNotifcations,
  setRerenderBookings,
  setFeedRefreshControl,
  setCardRefreshControl,
} = Rerenders.actions;
export default Rerenders.reducer;
