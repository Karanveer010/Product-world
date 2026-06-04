import React from "react";
import { View, StatusBar, StyleSheet, ViewStyle, StatusBarStyle, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { SIZES, SHADOWS } from "../constants/theme";

export interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  disableTopInset?: boolean;
  disableBottomInset?: boolean;
  statusBarStyle?: StatusBarStyle;
  statusBarColor?: string;
  translucent?: boolean;
  backgroundColor?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  containerStyle,
  disableTopInset = false,
  disableBottomInset = false,
  statusBarStyle = "dark-content",
  statusBarColor = "transparent",
  translucent = true,
  backgroundColor = COLORS.background,
}) => {
  const insets = useSafeAreaInsets();
  const netInfo = useNetInfo();
  const isOffline = netInfo.isConnected === false;
  const isOnline = netInfo.isConnected === true;

  const [showOnlineToast, setShowOnlineToast] = React.useState(false);
  const wasOfflineRef = React.useRef(false);

  React.useEffect(() => {
    if (isOffline) {
      wasOfflineRef.current = true;
      setShowOnlineToast(false);
    } else if (isOnline && wasOfflineRef.current) {
      wasOfflineRef.current = false;
      setShowOnlineToast(true);
      const timer = setTimeout(() => {
        setShowOnlineToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, isOnline]);

  return (
    <View style={[styles.outer, { backgroundColor }, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor}
        translucent={translucent}
      />
      {isOffline && (
        <View style={[styles.topBanner, { backgroundColor: COLORS.error, paddingTop: insets.top + 8, paddingBottom: 8 }]}>
          <Ionicons name="cloud-offline" size={14} color={COLORS.white} />
          <Text style={styles.topBannerText}>Internet connection off</Text>
        </View>
      )}
      {showOnlineToast && (
        <View style={[styles.topBanner, { backgroundColor: COLORS.success, paddingTop: insets.top + 8, paddingBottom: 8 }]}>
          <Ionicons name="checkmark-circle" size={14} color={COLORS.white} />
          <Text style={styles.topBannerText}>Internet connection back</Text>
        </View>
      )}
      <View
        style={[
          styles.inner,
          {
            paddingTop: (isOffline || showOnlineToast) ? 0 : (disableTopInset ? 0 : insets.top),
            paddingBottom: disableBottomInset ? 0 : insets.bottom,
          },
          containerStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,

  },
  inner: {
    flex: 1,

  },
  topBanner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  topBannerText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6,
  },
});

export default ScreenWrapper;
