import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  targetUser: null,
  loading: false,
  rerenderCurrentUser: false,
  scrollY: 0,
};

export const User = createSlice({
  name: "User",
  initialState,

  reducers: {
    setTargetUser: (state, action) => {
      state.targetUser = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRerenderCurrentUser: (state, action) => {
      state.rerenderCurrentUser = !state.rerenderCurrentUser;
    },
    setScrollYUser: (state, action) => {
      state.scrollY = action.payload;
    },
  },
});

export const {
  setTargetUser,
  setLoading,
  setRerenderCurrentUser,
  setScrollYUser,
} = User.actions;
export default User.reducer;
