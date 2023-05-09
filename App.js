import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Content from "./content";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Define the main component of the app
export default function App() {
  return (
    // Wrap the app in the Provider component to make the Redux store available to all components
    <SafeAreaProvider>
      <Provider store={store}>
        {/* Use the NavigationContainer component to provide a container for the app's navigation stack */}
        <NavigationContainer>
          {/* The main content of the app */}
          <Content />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
