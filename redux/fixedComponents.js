import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeScrollGallery: null,
};

export const FixedComponents = createSlice({
  name: "FixedComponents",
  initialState,

  reducers: {
    setActiveScrollGallery: (state, action) => {
      state.activeScrollGallery = action.payload;
    },
  },
});

export const { setActiveScrollGallery } = FixedComponents.actions;
export default FixedComponents.reducer;
