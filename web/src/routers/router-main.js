import {
  Routes,
  Route,
  Link,
  createBrowserRouter,
  useLocation,
  Navigate,
} from "react-router-dom";
import Welcome from "../pages/welcome/welcome";
import { Cards } from "../pages/cards/list";
import { User } from "../pages/user/user";
import { Feeds } from "../pages/feeds/list";
import { OpenedFeed } from "../pages/feeds/components/openedFeed";
import { UserFeeds } from "../pages/user/components/feeds";
import { Contact } from "../pages/user/components/contact";
import { Showroom } from "../pages/user/components/showroom";
import { OpenedUserFeed } from "../pages/user/components/openedUserFeed";
import { Procedures } from "../pages/user/components/procedures";
import { OpenedUserProduct } from "../pages/user/components/openedUserProduct";
import { WorkingInfo } from "../pages/user/components/workingInfo";
import { Main } from "../pages/marketplace/pages/market/main";
import { OpenedProduct } from "../pages/marketplace/components/openedProduct";
import { OpenedProductFromList } from "../pages/marketplace/pages/listPage/openedProduct";
import { List } from "../pages/marketplace/pages/listPage/list";
import { OpenedProductFromSearch } from "../pages/marketplace/pages/search/openedProduct";
import { SearchList } from "../pages/marketplace/pages/search/list";
import { Login } from "../pages/authentication/login";
import { useDispatch, useSelector } from "react-redux";
import { AddFeed } from "../pages/feeds/addFeed/addFeed";
import { Settings } from "../pages/settings/main";
import { Notifications } from "../pages/user/notifications/notifications";
import ChangePassword from "../pages/authentication/changePassword";
import { Identify } from "../pages/authentication/identify";
import { Type } from "../pages/authentication/type";
import { PersonalInfo } from "../pages/authentication/personalInfo";
import { Accept } from "../pages/authentication/accept";
import { Services } from "../pages/authentication/servicesInfo";
import { useEffect, useState } from "react";
import { setUnreadNotidications } from "../redux/notifications";

export const Routers = () => {
  const location = useLocation();
  const currentUser = JSON.parse(
    localStorage.getItem("Beautyverse:currentUser")
  );
  function RequireAuth({ children }) {
    if (!currentUser) {
      // Redirect them to your login page
      return <Navigate to="/login" state={{ from: location }} />;
    }

    // If authenticated, render the given child component
    return children;
  }
  function RequireLogout({ children }) {
    if (currentUser) {
      // Redirect them to your login page
      return <Navigate to="/feeds" state={{ from: location }} />;
    }

    // If authenticated, render the given child component
    return children;
  }

  /**
   * current user notifications
   */
  // dispatch
  const dispatch = useDispatch();

  // notifications state
  const [notifications, setNotifications] = useState([]);

  const rerenderNotifications = useSelector(
    (state) => state.storeNotifications.rerenderNotifications
  );

  useEffect(() => {
    setNotifications(currentUser.notifications);
    dispatch(
      setUnreadNotidications(
        currentUser?.notifications?.filter((item) => item?.status === "unread")
      )
    );
  }, [rerenderNotifications]);

  return (
    <Routes>
      {/* Base Routes */}
      <Route path="/" element={<Welcome />} />

      {/*  Feeds */}
      <Route path="/feeds" element={<Feeds />}>
        {/** opened feed */}
        <Route path=":feedId" element={<OpenedFeed />} />
      </Route>
      {/** user page */}
      <Route path="/feeds/user/:userId" element={<User back={"/feeds"} />}>
        <Route path="showroom" element={<Showroom />}>
          <Route path=":productId" element={<OpenedUserProduct />} />
        </Route>
        <Route path="feeds" element={<UserFeeds />}>
          <Route path=":feedId" element={<OpenedUserFeed />} />
        </Route>
        <Route path="contact" element={<Contact />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="workinginfo" element={<WorkingInfo />} />
      </Route>

      {/* Cards */}
      <Route path="/cards" element={<Cards />} />
      {/* User specific Routes for Cards */}
      <Route path="/cards/user/:userId" element={<User back="/cards" />}>
        <Route path="showroom" element={<Showroom />}>
          <Route path=":productId" element={<OpenedUserProduct />} />
        </Route>
        <Route path="feeds" element={<UserFeeds />}>
          <Route path=":feedId" element={<OpenedUserFeed />} />
        </Route>
        <Route path="contact" element={<Contact />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="workinginfo" element={<WorkingInfo />} />
      </Route>

      {/* Marketplace */}
      <Route path="/marketplace" element={<Main />}>
        <Route path=":productId" element={<OpenedProduct />} />
      </Route>
      {/* User specific Routes for Marketplace */}
      <Route
        path="/marketplace/user/:userId"
        element={<User back="/marketplace" />}
      >
        <Route path="showroom" element={<Showroom />}>
          <Route path=":productId" element={<OpenedUserProduct />} />
        </Route>
        <Route path="feeds" element={<UserFeeds />}>
          <Route path=":feedId" element={<OpenedUserFeed />} />
        </Route>
        <Route path="contact" element={<Contact />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="workinginfo" element={<WorkingInfo />} />
      </Route>
      {/** marketplace search */}
      <Route path="/marketplace/search" element={<SearchList />}>
        <Route path=":productId" element={<OpenedProductFromSearch />} />
      </Route>
      {/* User specific Routes for Marketplace search page */}
      <Route
        path="/marketplace/search/user/:userId"
        element={<User back={`/marketplace/search`} />}
      >
        <Route path="showroom" element={<Showroom />}>
          <Route path=":productId" element={<OpenedUserProduct />} />
        </Route>
        <Route path="feeds" element={<UserFeeds />}>
          <Route path=":feedId" element={<OpenedUserFeed />} />
        </Route>
        <Route path="contact" element={<Contact />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="workinginfo" element={<WorkingInfo />} />
      </Route>
      <Route path="/marketplace/list" element={<List />}>
        <Route path=":productId" element={<OpenedProductFromList />} />
      </Route>
      {/* User specific Routes for Marketplace list page */}
      <Route
        path="/marketplace/list/user/:userId"
        element={<User back={`/marketplace/list`} />}
      >
        <Route path="showroom" element={<Showroom />}>
          <Route path=":productId" element={<OpenedUserProduct />} />
        </Route>
        <Route path="feeds" element={<UserFeeds />}>
          <Route path=":feedId" element={<OpenedUserFeed />} />
        </Route>
        <Route path="contact" element={<Contact />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="workinginfo" element={<WorkingInfo />} />
      </Route>
      <Route path="/marketplace/list" element={<List />}>
        <Route path=":productId" element={<OpenedProductFromList />} />
      </Route>
      {/* Authentication */}
      <Route
        path="/login"
        element={
          <RequireLogout>
            <Login />
          </RequireLogout>
        }
      />
      <Route
        path="/resetPassword"
        element={
          <RequireLogout>
            <ChangePassword />
          </RequireLogout>
        }
      />
      <Route
        path="/register/identify"
        element={
          <RequireLogout>
            <Identify />
          </RequireLogout>
        }
      />
      <Route
        path="/register/type"
        element={
          <RequireLogout>
            <Type />
          </RequireLogout>
        }
      />
      <Route
        path="/register/personalinfo"
        element={
          <RequireLogout>
            <PersonalInfo />
          </RequireLogout>
        }
      />
      <Route
        path="/register/services"
        element={
          <RequireLogout>
            <Services />
          </RequireLogout>
        }
      />
      <Route
        path="/register/accept"
        element={
          <RequireLogout>
            <Accept />
          </RequireLogout>
        }
      />
      {/* 
     
     

      <Route path="/business" element={} />
       */}

      {/* Profile */}
      <Route path="/profile" element={currentUser ? <User /> : <Login />}>
        <Route path="showroom" element={<Showroom />}>
          <Route path=":productId" element={<OpenedUserProduct />} />
        </Route>
        <Route path="feeds" element={<UserFeeds />}>
          <Route path=":feedId" element={<OpenedUserFeed />} />
        </Route>
        <Route path="contact" element={<Contact />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="workinginfo" element={<WorkingInfo />} />
      </Route>
      <Route
        path="/profile/addfeed"
        element={currentUser ? <AddFeed /> : <Login />}
      />
      <Route
        path="/profile/settings"
        element={currentUser ? <Settings /> : <Login />}
      />
      <Route
        path="/profile/notifications"
        element={
          currentUser ? (
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
              currentUser={currentUser}
            >
              <Route path=":feedId" element={<OpenedUserFeed />} />
              <Route path=":productId" element={<OpenedUserProduct />} />
            </Notifications>
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/profile/visit/:userId"
        element={
          currentUser ? <User back={`/profile/notifications`} /> : <Login />
        }
      >
        <Route path="showroom" element={<Showroom />}>
          <Route path=":productId" element={<OpenedUserProduct />} />
        </Route>
        <Route path="feeds" element={<UserFeeds />}>
          <Route path=":feedId" element={<OpenedUserFeed />} />
        </Route>
        <Route path="contact" element={<Contact />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="workinginfo" element={<WorkingInfo />} />
      </Route>
    </Routes>
  );
};
