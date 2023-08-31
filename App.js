import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Content from "./content";
import { useRef, useState } from "react";
import { RouteNameContext } from "./context/routName";

// Define the main component of the app
export default function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const [currentRouteName, setCurrentRouteName] = useState("");

  const linking = {
    prefixes: ["exp://192.168.0.101:19000/--", "myapp://"],
    config: {
      screens: {
        Home: "home",
        Details: "details",
      },
    },
  };

  return (
    // Wrap the app in the Provider component to make the Redux store available to all components
    <Provider store={store}>
      {/* Use the NavigationContainer component to provide a container for the app's navigation stack */}
      <NavigationContainer
        linking={linking}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute().name;
          if (previousRouteName !== currentRouteName) {
            routeNameRef.current = currentRouteName;
            setCurrentRouteName(currentRouteName);
          }
        }}
      >
        {/* The main content of the app */}
        <RouteNameContext.Provider value={currentRouteName}>
          <Content />
        </RouteNameContext.Provider>
      </NavigationContainer>
    </Provider>
  );
}
