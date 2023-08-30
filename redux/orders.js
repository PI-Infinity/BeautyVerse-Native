import { createSlice } from "@reduxjs/toolkit";

import moment from "moment";
import "moment-timezone";
import * as Localization from "expo-localization";

let myDate = new Date();

// If you want to keep the format consistent with JavaScript's Date object, you can format it like so:
let formattedDateInTimezone = moment(myDate)
  .tz(Localization.timezone)
  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

const initialState = {
  loader: false,
  orders: [],
  statusFilter: "",
  date: { active: true, date: formattedDateInTimezone },
  createdAt: "",
  procedure: "",
  totalResult: null,
  filterResult: null,
  page: 1,
  new: null,
  active: null,
  pending: null,
  rejected: null,
  completed: null,
  canceled: null,
};

export const Orders = createSlice({
  name: "Orders",
  initialState,

  reducers: {
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrders: (state, action) => {
      action.payload.forEach((newOrder) => {
        // Check if this order is already in the state
        if (!state.orders.some((order) => order._id === newOrder._id)) {
          // If not, add it to the state
          state.orders.push(newOrder);
        }
      });
    },
    reduceOrders: (state, action) => {
      // Reduce state to the first 5 items
      state.orders = state.orders.slice(0, 5);
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setCreatedAt: (state, action) => {
      state.createdAt = action.payload;
    },
    setProcedure: (state, action) => {
      state.procedure = action.payload;
    },
    setTotalResult: (state, action) => {
      state.totalResult = action.payload;
    },
    setFilterResult: (state, action) => {
      state.filterResult = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setNewOrders: (state, action) => {
      state.new = action.payload;
    },
    setActiveOrders: (state, action) => {
      state.active = action.payload;
    },
    setRejectedOrders: (state, action) => {
      state.rejected = action.payload;
    },
    setCompletedOrders: (state, action) => {
      state.completed = action.payload;
    },
    setPendingOrders: (state, action) => {
      state.pending = action.payload;
    },
    setCanceledOrders: (state, action) => {
      state.canceled = action.payload;
    },
  },
});

export const {
  setLoader,
  setOrders,
  addOrders,
  reduceOrders,
  setStatusFilter,
  setDate,
  setProcedure,
  setCreatedAt,
  setTotalResult,
  setFilterResult,
  setPage,
  setNewOrders,
  setActiveOrders,
  setRejectedOrders,
  setCompletedOrders,
  setPendingOrders,
  setCanceledOrders,
} = Orders.actions;
export default Orders.reducer;
