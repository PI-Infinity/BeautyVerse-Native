import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  language: "ka",
  theme: true,
  users: [],
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
  },
});

export const { setLoading, setLanguage, setTheme, setUsers } = App.actions;
export default App.reducer;
