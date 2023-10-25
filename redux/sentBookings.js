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
  sentBookings: [],
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

export const SentBookings = createSlice({
  name: "SentBookings",
  initialState,

  reducers: {
    setLoaderSentBookings: (state, action) => {
      state.loader = action.payload;
    },
    setSentBookings: (state, action) => {
      state.sentBookings = action.payload;
    },
    addSentBookings: (state, action) => {
      action.payload.forEach((newBooking) => {
        // Check if this booking is already in the state
        if (
          !state.sentBookings.some((booking) => booking._id === newBooking._id)
        ) {
          // If not, add it to the state
          state.sentBookings.push(newBooking);
        }
      });
    },
    reduceSentBookings: (state, action) => {
      // Reduce state to the first 5 items
      state.sentBookings = state.sentBookings.slice(0, 5);
    },
    setStatusFilterSentBookings: (state, action) => {
      state.statusFilter = action.payload;
    },
    setDateSentBookings: (state, action) => {
      state.date = action.payload;
    },
    setCreatedAtSentBookings: (state, action) => {
      state.createdAt = action.payload;
    },
    setProcedureSentBookings: (state, action) => {
      state.procedure = action.payload;
    },
    setSentBookingsTotalResult: (state, action) => {
      state.totalResult = action.payload;
    },
    setSentBookingsFilterResult: (state, action) => {
      state.filterResult = action.payload;
    },
    setPageSentBookings: (state, action) => {
      state.page = action.payload;
    },
    setNewSentBookings: (state, action) => {
      state.new = action.payload;
    },
    setActiveSentBookings: (state, action) => {
      state.active = action.payload;
    },
    setRejectedSentBookings: (state, action) => {
      state.rejected = action.payload;
    },
    setCompletedSentBookings: (state, action) => {
      state.completed = action.payload;
    },
    setPendingSentBookings: (state, action) => {
      state.pending = action.payload;
    },
    setCanceledSentBookings: (state, action) => {
      state.canceled = action.payload;
    },
  },
});

export const {
  setLoaderSentBookings,
  setSentBookings,
  addSentBookings,
  reduceSentBookings,
  setStatusFilterSentBookings,
  setDateSentBookings,
  setCreatedAtSentBookings,
  setProcedureSentBookings,
  setSentBookingsTotalResult,
  setSentBookingsFilterResult,
  setPageSentBookings,
  setNewSentBookings,
  setActiveSentBookings,
  setRejectedSentBookings,
  setCompletedSentBookings,
  setPendingSentBookings,
  setCanceledSentBookings,
} = SentBookings.actions;
export default SentBookings.reducer;
