import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import AppNavigator from "./src/routes/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const linking: any = {
    prefixes: [
      'productworld://',
      'https://io.pixelsoftwares.com',
    ],
    config: {
      screens: {
        MainApp: {
          screens: {
            Home: 'home',
          },
        },
        ProductDetail: 'product/:id',
      },
    },
  };
  return (
    <Provider store={store}>
      <PersistGate
        loading={<> </>}
        persistor={persistor}
        onBeforeLift={() => console.log("Persist loaded")}
      >
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}