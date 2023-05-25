import { configureStore } from "@reduxjs/toolkit";
import AppReducer from "./app";
import AuthReducer from "./auth";
import RerendersReducer from "./rerenders";
import UserReducer from "./user";
import ActionsReducer from "./actions";
import FilterReducer from "./filter";
import ChatReducer from "./chat";
import FeedReducer from "./feed";
import OrdersReducer from "./orders";

export const store = configureStore({
  reducer: {
    storeApp: AppReducer,
    storeAuth: AuthReducer,
    storeRerenders: RerendersReducer,
    storeUser: UserReducer,
    storeActions: ActionsReducer,
    storeFilter: FilterReducer,
    storeChat: ChatReducer,
    storeFeed: FeedReducer,
    storeOrders: OrdersReducer,
  },
});
