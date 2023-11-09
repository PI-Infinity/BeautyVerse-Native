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

  // active tab bat
  activeTabBar: "Feeds",

  // lcoation
  location: { country: null, city: null, latitude: null, longitude: null },

  // screens modal state
  screenModal: [],
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
    setActiveTabBar: (state, action) => {
      state.activeTabBar = action.payload;
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
    setScreenModal: (state, action) => {
      const { active, screen, data, activeTabBar } = action.payload;

      // Check if there's an existing modal with the same route.name
      const existingIndex = state.screenModal.findIndex(
        (modal) => modal.activeTabBar === activeTabBar
      );

      const newModal = {
        active,
        screen,
        data,
        activeTabBar: state.activeTabBar,
      };

      if (existingIndex !== -1) {
        // If an existing modal is found, replace it
        state.screenModal[existingIndex] = newModal;
      } else {
        // If no existing modal is found, add the new modal to the array
        state.screenModal.push(newModal);
      }
    },
    removeScreenModal: (state, action) => {
      const tabBarName = action.payload;
      state.screenModal = state.screenModal.filter(
        (modal) => modal.activeTabBar !== tabBarName
      );
    },
    cleanScreenModal: (state, action) => {
      state.screenModal = [];
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
  setActiveTabBar,
  setLocation,
  setDevicePushToken,
  setBlur,
  setScreenModal,
  removeScreenModal,
  cleanScreenModal,
} = App.actions;
export default App.reducer;
