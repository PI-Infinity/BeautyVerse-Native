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
  bookings: [],
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

export const Bookings = createSlice({
  name: "Bookings",
  initialState,

  reducers: {
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    addBookings: (state, action) => {
      action.payload.forEach((newBooking) => {
        // Check if this booking is already in the state
        if (!state.bookings.some((booking) => booking._id === newBooking._id)) {
          // If not, add it to the state
          state.bookings.push(newBooking);
        }
      });
    },
    reduceBookings: (state, action) => {
      // Reduce state to the first 5 items
      state.bookings = state.bookings.slice(0, 5);
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
    setNewBookings: (state, action) => {
      state.new = action.payload;
    },
    setActiveBookings: (state, action) => {
      state.active = action.payload;
    },
    setRejectedBookings: (state, action) => {
      state.rejected = action.payload;
    },
    setCompletedBookings: (state, action) => {
      state.completed = action.payload;
    },
    setPendingBookings: (state, action) => {
      state.pending = action.payload;
    },
    setCanceledBookings: (state, action) => {
      state.canceled = action.payload;
    },
  },
});

export const {
  setLoader,
  setBookings,
  addBookings,
  reduceBookings,
  setStatusFilter,
  setDate,
  setProcedure,
  setCreatedAt,
  setTotalResult,
  setFilterResult,
  setPage,
  setNewBookings,
  setActiveBookings,
  setRejectedBookings,
  setCompletedBookings,
  setPendingBookings,
  setCanceledBookings,
} = Bookings.actions;
export default Bookings.reducer;
