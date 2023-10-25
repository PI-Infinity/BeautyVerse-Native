import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // send report alert message
  sendReport: false,
};

export const Alert = createSlice({
  name: "Alert",
  initialState,

  reducers: {
    setSendReport: (state, action) => {
      state.sendReport = action.payload;
    },
  },
});

export const { setSendReport } = Alert.actions;
export default Alert.reducer;
