import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  randomProductsList: [],
  bestSellersList: [],
  latestList: [],

  userProductListingPage: 1,
  userProducts: [],

  rerenderProducts: false,

  // filter
  categories: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  discounts: "",
  sex: "all",
  type: "everyone",

  // list screens modal
  listScreenModal: { active: false, screen: "", data: {} },
};

export const Marketplace = createSlice({
  name: "Marketplace",
  initialState,

  reducers: {
    setRandomProductsList: (state, action) => {
      state.randomProductsList = action.payload;
    },
    setBestSellersList: (state, action) => {
      state.bestSellersList = action.payload;
    },
    setLatestList: (state, action) => {
      state.latestList = action.payload;
    },
    setUserProductListingPage: (state, action) => {
      state.userProductListingPage = action.payload;
    },
    setUserProducts: (state, action) => {
      state.userProducts = action.payload;
    },
    setRerenderProducts: (state, action) => {
      state.rerenderProducts = !state.rerenderProducts;
    },

    // filter
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
    // screen modal
    setListScreenModal: (state, action) => {
      state.listScreenModal = action.payload;
    },
  },
});

export const {
  setRandomProductsList,
  setBestSellersList,
  setLatestList,
  setUserProductListingPage,
  setUserProducts,
  setRerenderProducts,
  //filter
  setCategories,
  setBrands,
  setDiscounts,
  setMinPrice,
  setMaxPrice,
  setSex,
  setType,
  // screen modal
  setListScreenModal,
} = Marketplace.actions;
export default Marketplace.reducer;
