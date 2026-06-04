import React, { useCallback } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../redux/store";
import { toggleLike } from "../redux/slices/likesSlice";
import { addToCart } from "../redux/slices/cartSlice";
import COLORS from "../constants/colors";
import FurnitureCardList from "../components/FurnitureCardList";
import { Ionicons } from "@expo/vector-icons";

export const LikesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const items = useSelector((state: RootState) => state.furniture.items);
  const likedIds = useSelector((state: RootState) => state.likes.likedIds);

  const likedItems = items.filter((item) => likedIds.includes(String(item.id)));

  const handleLikePress = useCallback(
    (id: string) => {
      dispatch(toggleLike(id));
    },
    [dispatch]
  );

  const handleAddToCartPress = useCallback(
    (id: string) => {
      dispatch(addToCart(id));
    },
    [dispatch]
  );

  const handleCardPress = useCallback(
    (item: any) => {
      navigation.navigate("ProductDetail", { item });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: typeof items[0] }) => (
      <FurnitureCardList
        item={item}
        isLiked={true}
        onLikePress={handleLikePress}
        onAddToCartPress={handleAddToCartPress}
        onPress={handleCardPress}
        showDelete={true}
      />
    ),
    [handleLikePress, handleAddToCartPress, handleCardPress]
  );

  return (
    <ScreenWrapper disableBottomInset={true}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Wishlist</Text>

        {likedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Your wishlist is empty.</Text>
            <Text style={styles.subText}>Tap the heart icon on your favorite products to save them here.</Text>
          </View>
        ) : (
          <FlatList
            data={likedItems}
            keyExtractor={(item) => String(item?.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  subText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});

export default LikesScreen;
