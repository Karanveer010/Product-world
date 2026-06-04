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
      <View
        style={[
          styles.inner,
          {
            paddingTop: disableTopInset ? 0 : insets.top,
            paddingBottom: disableBottomInset ? 0 : insets.bottom,
          },
          containerStyle,
        ]}
      >
        {children}
      </View>
      {isOffline && (
        <View style={[styles.offlineToast, { bottom: insets.bottom + 16 }]}>
          <Ionicons name="cloud-offline" size={16} color={COLORS.white} />
          <Text style={styles.offlineToastText}>Internet connection off</Text>
        </View>
      )}
      {showOnlineToast && (
        <View style={[styles.onlineToast, { bottom: insets.bottom + 16 }]}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
          <Text style={styles.onlineToastText}>Internet connection back</Text>
        </View>
      )}
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
  offlineToast: {
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.medium,
    zIndex: 9999,
  },
  offlineToastText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
  onlineToast: {
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: COLORS.success,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.medium,
    zIndex: 9999,
  },
  onlineToastText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
});

export default ScreenWrapper;
