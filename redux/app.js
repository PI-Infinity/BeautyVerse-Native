import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  logoutLoading: false,
  language: "ka",
  theme: true,
  users: [],
  // result shows total of result of feeds
  feedsResult: 0,
  // result shows total of result of cards
  cardsResult: 0,
  machineId: null,
  zoomToTop: false,
  backendUrl: "https://beautyverse.herokuapp.com",
  // backendUrl: "http://192.168.0.106:5000",
  devicePushToken: null,

  // blur background switcher
  blur: false,

  location: { country: null, city: null, latitude: null, longitude: null },
};

export const App = createSlice({
  name: "App",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLogoutLoading: (state, action) => {
      state.logoutLoading = action.payload;
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
    setZoomToTop: (state, action) => {
      state.zoomToTop = !state.zoomToTop;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setDevicePushToken: (state, action) => {
      state.devicePushToken = action.payload;
    },
    setBlur: (state, action) => {
      state.blur = action.payload;
    },
  },
});

export const {
  setLoading,
  setLogoutLoading,
  setLanguage,
  setTheme,
  setUsers,
  setMachineId,
  setFeedsResult,
  setCardsResult,
  setZoomToTop,
  setLocation,
  setDevicePushToken,
  setBlur,
} = App.actions;
export default App.reducer;
