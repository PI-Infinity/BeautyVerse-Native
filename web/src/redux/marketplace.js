import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  randomProductsList: [],

  // active list in list page
  activeList: [],

  scrollY: 0,
  rerenderMarketplace: false,
  scrollYSearch: 0,
  scrollYList: 0,

  // filter
  search: "",
  categories: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  discounts: "",
  sex: "all",
  type: "everyone",

  // opened product
  openedProduct: null,
};

export const Marketplace = createSlice({
  name: "Marketplace",
  initialState,

  reducers: {
    setRandomProductsList: (state, action) => {
      state.randomProductsList = action.payload;
    },
    setActiveList: (state, action) => {
      state.list = action.payload;
    },
    setScrollYMarketplace: (state, action) => {
      state.scrollY = action.payload;
    },
    setScrollYMarketplaceSearch: (state, action) => {
      state.scrollYSearch = action.payload;
    },
    setScrollYList: (state, action) => {
      state.scrollYList = action.payload;
    },
    setRerenderMarketplace: (state, action) => {
      state.rerenderMarketplace = !state.rerenderMarketplace;
    },
    // filter
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setDiscounts: (state, action) => {
      state.discounts = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setSex: (state, action) => {
      state.sex = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setOpenedProduct: (state, action) => {
      state.openedProduct = action.payload;
    },
  },
});

export const {
  setRandomProductsList,
  setActiveList,
  setScrollYMarketplace,
  setScrollYMarketplaceSearch,
  setScrollYList,
  setRerenderMarketplace,
  //filter
  setSearch,
  setCategories,
  setBrands,
  setDiscounts,
  setMinPrice,
  setMaxPrice,
  setSex,
  setType,
  setOpenedProduct,
} = Marketplace.actions;
export default Marketplace.reducer;
