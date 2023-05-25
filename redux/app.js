import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  language: "ka",
  theme: true,
  users: [],
  // result shows total of result of feeds
  feedsResult: 0,
  // result shows total of result of cards
  cardsResult: 0,
  machindeId: null,
};

export const App = createSlice({
  name: "App",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setFeedsResult: (state, action) => {
      state.feedsResult = action.payload;
    },
    setCardsResult: (state, action) => {
      state.cardsResult = action.payload;
    },
    setMachineId: (state, action) => {
      state.machineId = action.payload;
    },
  },
});

export const {
  setLoading,
  setLanguage,
  setTheme,
  setUsers,
  setMachineId,
  setFeedsResult,
  setCardsResult,
} = App.actions;
export default App.reducer;
