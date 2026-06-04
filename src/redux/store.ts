import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import furnitureReducer from "./slices/furnitureSlice";
import cartReducer from "./slices/cartSlice";
import likesReducer from "./slices/likesSlice";
import loaderReducer from "./slices/loaderSlice";
import userDataReducer from "./slices/userDataSlice";

const rootReducer = combineReducers({
  furniture: furnitureReducer,
  cart: cartReducer,
  likes: likesReducer,
  loader: loaderReducer,
  userData: userDataReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["furniture", "cart", "likes", "userData"],
  blacklist: ["loader"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
