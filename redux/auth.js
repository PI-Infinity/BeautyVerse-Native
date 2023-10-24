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
    setType: (state, action) => {
      state.userType = action.payload;
    },
  },
});

export const { setType, setCurrentUser } = Auth.actions;
export default Auth.reducer;
