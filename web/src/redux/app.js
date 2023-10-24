import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // backendUrl: "http://192.168.0.105:5000",
  backendUrl: "https://beautyverse.herokuapp.com",
  language: "en",
  scrollToTop: false,
};

export const App = createSlice({
  name: "App",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setScrollToTop: (state, action) => {
      state.scrollToTop = !state.scrollToTop;
    },
  },
});

export const { setLanguage, setScrollToTop } = App.actions;
export default App.reducer;
