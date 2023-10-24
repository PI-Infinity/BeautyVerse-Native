import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  list: [],
  brandsList: [],
  categoriesList: [],

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

export const Showroom = createSlice({
  name: "Showroom",
  initialState,

  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    AddList: (state, action) => {
      const newProducts = action.payload;
      const uniquenewProducts = newProducts.filter(
        (newProduct) =>
          !state.list.some((prevProduct) => prevProduct._id === newProduct._id)
      );
      state.list.push(...uniquenewProducts);
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    // filter
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategoriesList: (state, action) => {
      state.categoriesList = action.payload;
    },
    setBrandsList: (state, action) => {
      state.brandsList = action.payload;
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
  setPage,
  setList,
  AddList,
  setBrandsList,
  setCategoriesList,
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
} = Showroom.actions;
export default Showroom.reducer;
