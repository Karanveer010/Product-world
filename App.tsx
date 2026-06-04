import React, { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import AppNavigator from "./src/routes/AppNavigator";

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => setReady(true)}
      >
        {ready ? <AppNavigator /> : null}
      </PersistGate>
    </Provider>
  );
}