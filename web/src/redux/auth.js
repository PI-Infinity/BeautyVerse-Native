import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  userType: null,
};

export const Auth = createSlice({
  name: "Auth",
  initialState,

  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
  },
});

export const { setCurrentUser, setUserType } = Auth.actions;
export default Auth.reducer;
