import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import IntroScreen from "../screens/IntroScreen";
import TabNavigator from "./TabNavigator";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const onboardingCompleted = useSelector(
    (state: RootState) => state?.furniture?.onboardingCompleted ?? false
  );

  // const linking = {
  //   prefixes: [
  //     'productworld://',
  //     'https://io.pixelsoftwares.com',
  //   ],
  // };


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        <Stack.Screen name="Intro" component={IntroScreen} />
      ) : (
        <>
          <Stack.Screen name="MainApp" component={TabNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
