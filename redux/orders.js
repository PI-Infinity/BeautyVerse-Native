import { createSlice } from "@reduxjs/toolkit";

const currentTime = new Date();

const initialState = {
  orders: [],
  statusFilter: null,
  date: currentTime.toISOString(),
};

export const Orders = createSlice({
  name: "Orders",
  initialState,

  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const { setOrders, setStatusFilter, setDate } = Orders.actions;
export default Orders.reducer;
