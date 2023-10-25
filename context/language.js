import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MainFavourites from "../languages/pages/main/favorites";
import MainAds from "../languages/pages/main/ads";
import MainReviews from "../languages/pages/main/reviews";
import MainFilter from "../languages/pages/main/filter";
import MainFeedCard from "../languages/pages/main/feedCard";
import Menu from "../languages/components/menu";
import User from "../languages/pages/user/user";
import Chat from "../languages/pages/chat/chat";
import Bookings from "../languages/pages/bookings/bookings";
import Auth from "../languages/pages/auth/auth";
import Pages from "../languages/pages/pages";
import Marketplace from "../languages/pages/marketplace/marketplace";
import Prices from "../languages/pages/prices";

export const Language = () => {
  const lang = useSelector((state) => state.storeApp.language);

  if (lang === "en") {
    return {
      language: {
        Main: {
          reviews: MainReviews.en,
          ads: MainAds.en,
          favourites: MainFavourites.en,
          filter: MainFilter.en,
          feedCard: MainFeedCard.en,
          menu: Menu.en,
        },
        User: {
          userPage: User.en,
          addFeed: User.en,
        },
        Chat: {
          chat: Chat.en,
        },
        Bookings: {
          bookings: Bookings.en,
        },
        Auth: {
          auth: Auth.en,
        },
        Pages: {
          pages: Pages.en,
        },
        Marketplace: {
          marketplace: Marketplace.en,
        },
        Prices: {
          prices: Prices.en,
        },
      },
    };
  } else if (lang === "ka") {
    return {
      language: {
        Main: {
          reviews: MainReviews.ka,
          ads: MainAds.ka,
          favourites: MainFavourites.ka,
          filter: MainFilter.ka,
          feedCard: MainFeedCard.ka,
          menu: Menu.ka,
        },
        User: {
          userPage: User.ka,
          addFeed: User.ka,
        },
        Chat: {
          chat: Chat.ka,
        },
        Bookings: {
          bookings: Bookings.ka,
        },
        Auth: {
          auth: Auth.ka,
        },
        Pages: {
          pages: Pages.ka,
        },
        Marketplace: {
          marketplace: Marketplace.ka,
        },
        Prices: {
          prices: Prices.ka,
        },
      },
    };
  } else if (lang === "ru") {
    return {
      language: {
        Main: {
          reviews: MainReviews.ru,
          ads: MainAds.ru,
          favourites: MainFavourites.ru,
          filter: MainFilter.ru,
          feedCard: MainFeedCard.ru,
          menu: Menu.ru,
        },
        User: {
          userPage: User.ru,
          addFeed: User.ru,
        },
        Chat: {
          chat: Chat.ru,
        },
        Bookings: {
          bookings: Bookings.ru,
        },
        Auth: {
          auth: Auth.ru,
        },
        Pages: {
          pages: Pages.ru,
        },
        Marketplace: {
          marketplace: Marketplace.ru,
        },
        Prices: {
          prices: Prices.ru,
        },
      },
    };
  }
};
