import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadNotifications: [],
  page: 1,
};

export const Notifications = createSlice({
  name: "Notifications",
  initialState,

  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    addNotifications: (state, action) => {
      const newNotifications = action.payload.filter(
        (newNotification) =>
          !state.notifications.some(
            (existingNotification) =>
              existingNotification._id === newNotification._id
          )
      );
      state.notifications.push(...newNotifications);
    },
    addUnreadNotifications: (state, action) => {
      const newUnreadNotifications = action.payload.filter(
        (newUnreadNotification) =>
          !state.unreadNotifications.some(
            (existingUnreadNotification) =>
              existingUnreadNotification._id === newUnreadNotification._id
          )
      );
      state.unreadNotifications.push(...newUnreadNotifications);
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setNotifications,
  setUnreadNotifications,
  addNotifications,
  addUnreadNotifications,
  setPage,
} = Notifications.actions;
export default Notifications.reducer;
