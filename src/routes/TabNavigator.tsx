import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import LikesScreen from "../screens/LikesScreen";
import BagScreen from "../screens/BagScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import COLORS from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
          height: 64 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 8,
          paddingTop: 8,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: keyof typeof Ionicons.prototype.keys | string = "";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Likes":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Bag":
              iconName = focused ? "bag" : "bag-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Setting":
              iconName = focused ? "settings" : "settings-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName as any} size={focused ? size + 2 : size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Likes" component={LikesScreen} options={{ tabBarLabel: "Likes" }} />
      <Tab.Screen name="Bag" component={BagScreen} options={{ tabBarLabel: "Bag" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Profile" }} />
      <Tab.Screen name="Setting" component={SettingsScreen} options={{ tabBarLabel: "Setting" }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
