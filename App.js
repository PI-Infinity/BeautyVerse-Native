import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import Content from "./content";
import { RouteNameContext } from "./context/routName";
import { store } from "./redux/store";

/**
 * The main component of the app
 * */
export default function App() {
  const navigationRef = useNavigationContainerRef();
  // get route names manually for later using sometimes in architecture
  const routeNameRef = useRef();
  const [currentRouteName, setCurrentRouteName] = useState("");

  return (
    // Wrap the app in the Provider component to make the Redux store available to all components
    <Provider store={store}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* Use the NavigationContainer component to provide a container for the app's navigation stack */}
        <NavigationContainer
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
          theme={{ colors: { background: "transparent" } }}
        >
          {/* The main content of the app */}
          <RouteNameContext.Provider value={currentRouteName}>
            <Content />
          </RouteNameContext.Provider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}
