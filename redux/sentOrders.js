import { createSlice } from "@reduxjs/toolkit";

import moment from "moment";
import "moment-timezone";
import * as Localization from "expo-localization";

// If you have a date object and want to convert it to a specific timezone:
let myDate = new Date();

// If you want to keep the format consistent with JavaScript's Date object, you can format it like so:
let formattedDateInTimezone = moment(myDate)
  .tz(Localization.timezone)
  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

const initialState = {
  loader: false,
  orders: [],
  statusFilter: "",
  date: { active: false, date: formattedDateInTimezone },
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

export const SentOrders = createSlice({
  name: "SentOrders",
  initialState,

  reducers: {
    setLoaderSentOrders: (state, action) => {
      state.loader = action.payload;
    },
    setSentOrders: (state, action) => {
      state.orders = action.payload;
    },
    addSentOrders: (state, action) => {
      action.payload.forEach((newOrder) => {
        // Check if this order is already in the state
        if (!state.orders.some((order) => order._id === newOrder._id)) {
          // If not, add it to the state
          state.orders.push(newOrder);
        }
      });
    },
    reduceSentOrders: (state, action) => {
      // Reduce state to the first 5 items
      state.orders = state.orders.slice(0, 5);
    },
    setStatusFilterSentOrders: (state, action) => {
      state.statusFilter = action.payload;
    },
    setDateSentOrders: (state, action) => {
      state.date = action.payload;
    },
    setCreatedAtSentOrders: (state, action) => {
      state.createdAt = action.payload;
    },
    setProcedureSentOrders: (state, action) => {
      state.procedure = action.payload;
    },
    setSentOrdersTotalResult: (state, action) => {
      state.totalResult = action.payload;
    },
    setSentOrdersFilterResult: (state, action) => {
      state.filterResult = action.payload;
    },
    setPageSentOrders: (state, action) => {
      state.page = action.payload;
    },
    setNewSentOrders: (state, action) => {
      state.new = action.payload;
    },
    setActiveSentOrders: (state, action) => {
      state.active = action.payload;
    },
    setRejectedSentOrders: (state, action) => {
      state.rejected = action.payload;
    },
    setCompletedSentOrders: (state, action) => {
      state.completed = action.payload;
    },
    setPendingSentOrders: (state, action) => {
      state.pending = action.payload;
    },
    setCanceledSentOrders: (state, action) => {
      state.canceled = action.payload;
    },
  },
});

export const {
  setLoaderSentOrders,
  setSentOrders,
  addSentOrders,
  reduceSentOrders,
  setStatusFilterSentOrders,
  setDateSentOrders,
  setCreatedAtSentOrders,
  setProcedureSentOrders,
  setSentOrdersTotalResult,
  setSentOrdersFilterResult,
  setPageSentOrders,
  setNewSentOrders,
  setActiveSentOrders,
  setRejectedSentOrders,
  setCompletedSentOrders,
  setPendingSentOrders,
  setCanceledSentOrders,
} = SentOrders.actions;
export default SentOrders.reducer;
