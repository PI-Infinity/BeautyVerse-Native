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

  rerenderUserFeeds: false,
  rerenderUserFeed: false,

  rerenderNotifications: false,
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
    setRerenderNotifcations: (state, action) => {
      state.rerenderNotifications = !state.rerenderNotifications;
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
  setRerenderNotifcations,
} = Rerenders.actions;
export default Rerenders.reducer;
