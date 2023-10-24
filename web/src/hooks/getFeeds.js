import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setFeeds,
  setFollowingsFeeds,
  setPage,
} from "../redux/feeds";

export const GetFeeds = () => {
  // dispatch
  const dispatch = useDispatch();
  // getting feeds
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  // getting feeds
  const rerenderFeeds = useSelector((state) => state.storeFeeds.rerenderFeeds);

  const GettingFeeds = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?page=1&limit=3`
      );
      dispatch(setFeeds(response.data.data.feedlist));
      dispatch(setLoading(false));
      dispatch(setPage(1));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  //   const GettingFollowingsFeeds = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${backendUrl}/api/v1/feeds/followings?page=1&limit=3`
  //       );
  //       console.log(response.data.data.feedlist);
  //       dispatch(setFollowingsFeeds(response.data.data.feedlist));
  //       dispatch(setLoading(false));
  //     } catch (error) {
  //       console.log(error.response);
  //     }
  //   };
  useEffect(() => {
    GettingFeeds();
    // GettingFollowingsFeeds()
  }, [rerenderFeeds]);
};
