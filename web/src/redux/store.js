import { configureStore } from "@reduxjs/toolkit";
import AppReducer from "./app";
import UserReducer from "./user";
import FeedsReducer from "./feeds";
import FeedReducer from "./feed";
import CardsReducer from "./cards";
import ShowRoom from "./showroom";
import MarketplaceReducer from "./marketplace";
import NotificationsReducer from "./notifications";
import AuthReducer from "./auth";

export const store = configureStore({
  reducer: {
    storeApp: AppReducer,
    storeUser: UserReducer,
    storeFeeds: FeedsReducer,
    storeFeed: FeedReducer,
    storeCards: CardsReducer,
    storeShowroom: ShowRoom,
    storeMarketplace: MarketplaceReducer,
    storeNotifications: NotificationsReducer,
    storeAuth: AuthReducer,
  },
});
