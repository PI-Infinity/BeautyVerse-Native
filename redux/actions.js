import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeFeedFromScrollGallery: null,
};

export const Actions = createSlice({
  name: "Actions",
  initialState,

  reducers: {
    setActiveFeedFromScrollGallery: (state, action) => {
      state.activeFeedFromScrollGallery = action.payload;
    },
  },
});

export const { setActiveFeedFromScrollGallery } = Actions.actions;
export default Actions.reducer;
