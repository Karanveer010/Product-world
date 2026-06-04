import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { useDispatch } from "react-redux";
import {
  resetOnboarding,
  setFurnitureItems,
} from "../redux/slices/furnitureSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { clearLikes } from "../redux/slices/likesSlice";
import { resetUserData } from "../redux/slices/userDataSlice";
import COLORS from "../constants/colors";
import { SIZES, SHADOWS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface SettingItem {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  label: string;
  onPress: () => void;
}

export const SettingsScreen = () => {
  const dispatch = useDispatch();

  const handleResetOnboarding = () => {
    dispatch(resetOnboarding());
    Alert.alert(
      "Success",
      "Onboarding intro has been reset. Restart the app or navigate to see it.",
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the offline product cache?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            dispatch(setFurnitureItems({ items: [], total: 0, skip: 0 }));
            Alert.alert("Success", "Offline product cache has been cleared.");
          },
        },
      ],
    );
  };

  const handleResetUserData = () => {
    Alert.alert(
      "Reset User Data & Orders",
      "Are you sure you want to clear your cart, favorites, and reset your orders count?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            dispatch(resetUserData());
            dispatch(clearCart());
            dispatch(clearLikes());
            Alert.alert("Success", "All user data, orders, cart, and favorites have been reset.");
          },
        },
      ],
    );
  };

  const settingsData: SettingItem[] = [
    {
      key: "reset_onboarding",
      icon: "refresh",
      iconBgColor: COLORS.primary,
      label: "Reset Onboarding Flow",
      onPress: handleResetOnboarding,
    },
    {
      key: "clear_cache",
      icon: "trash",
      iconBgColor: COLORS.error,
      label: "Clear Offline Cache",
      onPress: handleClearCache,
    },
    {
      key: "reset_userdata",
      icon: "person-remove",
      iconBgColor: "#f59e0b",
      label: "Reset User Data & Orders",
      onPress: handleResetUserData,
    },
  ];

  const renderSettingItem = ({
    item,
    index,
  }: {
    item: SettingItem;
    index: number;
  }) => {
    const isLast = index === settingsData.length - 1;
    return (
      <TouchableOpacity
        onPress={item.onPress}
        activeOpacity={0.7}
        style={[styles.settingItem, isLast && { borderBottomWidth: 0 }]}
      >
        <View style={styles.settingLeft}>
          <View
            style={[styles.iconWrapper, { backgroundColor: item.iconBgColor }]}
          >
            <Ionicons name={item.icon} size={20} color={COLORS.white} />
          </View>
          <Text style={styles.settingLabel}>{item.label}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper disableBottomInset={true}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Settings</Text>

        <FlatList
          data={settingsData}
          keyExtractor={(item) => item.key}
          renderItem={renderSettingItem}
          contentContainerStyle={styles.settingsList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  settingsList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    paddingVertical: 8,
    ...SHADOWS.light,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default SettingsScreen;
