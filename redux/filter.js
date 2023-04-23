import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  filter: "",
  specialists: true,
  salons: true,
  country: "",
  city: "",
  district: "",
  filterBadge: 0,
};

export const Filter = createSlice({
  name: "Filter",
  initialState,

  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSpecialists: (state, action) => {
      state.specialists = action.payload;
    },
    setSalons: (state, action) => {
      state.salons = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setDistrict: (state, action) => {
      state.district = action.payload;
    },
    setFilterBadgeSum: (state, action) => {
      state.filterBadgeSum = action.payload;
    },
  },
});

export const {
  setSearch,
  setFilter,
  setSpecialists,
  setSalons,
  setCity,
  setDistrict,
  setFilterBadgeSum,
} = Filter.actions;
export default Filter.reducer;
