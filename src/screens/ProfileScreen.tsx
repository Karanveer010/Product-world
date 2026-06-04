import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import COLORS from "../constants/colors";
import { SIZES } from "../constants/theme";

export const ProfileScreen = () => {
  const profile = useSelector((state: RootState) => state.userData.profile);
  const ordersCountRaw = useSelector((state: RootState) => state.userData.ordersCount);
  const ordersCount = typeof ordersCountRaw === "number" && !isNaN(ordersCountRaw) ? ordersCountRaw : 0;
  const likedIds = useSelector((state: RootState) => state.likes.likedIds);

  const userName = profile?.name || "Guest User";
  const userEmail = profile?.email || "guest.user@example.com";
  const favoritesCount = likedIds?.length || 0;

  return (
    <ScreenWrapper disableBottomInset={true}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={54} color={COLORS.white} />
          </View>

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{ordersCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{favoritesCount}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    width: "100%",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export default ProfileScreen;
