import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedsScrollY: 0,
  feedsScrollYF: 0,
  cardsScrollY: 0,
  profileScrollY: 0,
  marketplaceScrollY: 0,
};

export const Scrolls = createSlice({
  name: "Scrolls",
  initialState,

  reducers: {
    setFeedsScrollY: (state, action) => {
      state.feedsScrollY = action.payload;
    },
    setFeedsScrollYF: (state, action) => {
      state.feedsScrollYF = action.payload;
    },
    setCardsScrollY: (state, action) => {
      state.cardsScrollY = action.payload;
    },
    setProfileScrollY: (state, action) => {
      state.profileScrollY = action.payload;
    },
    setMarketplaceScrollY: (state, action) => {
      state.marketplaceScrollY = action.payload;
    },
  },
});

export const {
  setFeedsScrollY,
  setFeedsScrollYF,
  setCardsScrollY,
  setProfileScrollY,
  setMarketplaceScrollY,
} = Scrolls.actions;
export default Scrolls.reducer;
