import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  searchInput: "",
  filter: "",
  specialists: true,
  salons: true,
  shops: true,
  country: "",
  city: "",
  district: "",
  filterBadge: 0,
  filterScreenModal: { active: false, screen: "", data: {} },
};

export const Filter = createSlice({
  name: "Filter",
  initialState,

  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
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
    setShops: (state, action) => {
      state.shops = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setDistrict: (state, action) => {
      state.district = action.payload;
    },
    setFilterBadgeSum: (state, action) => {
      state.filterBadge = action.payload;
    },
    setFilterScreenModal: (state, action) => {
      state.filterScreenModal = action.payload;
    },
  },
});

export const {
  setSearch,
  setSearchInput,
  setFilter,
  setSpecialists,
  setSalons,
  setShops,
  setCity,
  setDistrict,
  setFilterBadgeSum,
  setFilterScreenModal,
} = Filter.actions;
export default Filter.reducer;
