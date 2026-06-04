import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { FurnitureItem } from "../redux/slices/furnitureSlice";
import COLORS from "../constants/colors";
import { SIZES, SHADOWS } from "../constants/theme";
import IMAGE_MAP from "../constants/images";
import { hp, wp } from "../utils/responsive";
import AddButton from "./AddButton";

interface FurnitureCardListProps {
  item: FurnitureItem;
  isLiked: boolean;
  onLikePress: (id: string) => void;
  onAddToCartPress: (id: string) => void;
  onPress?: (item: FurnitureItem) => void;
  showDelete?: boolean;
}

export const FurnitureCardList: React.FC<FurnitureCardListProps> = React.memo(
  ({ item, isLiked, onLikePress, onAddToCartPress, onPress, showDelete }) => {
    const handlePress = useCallback(() => onPress?.(item), [onPress, item]);
    const handleLike = useCallback(() => onLikePress(String(item.id)), [onLikePress, item.id]);
    const handleAddToCart = useCallback(() => onAddToCartPress(String(item.id)), [onAddToCartPress, item.id]);
    const imageSource = item?.thumbnail || (item?.images && item?.images[0]) || item?.image || "";

    const stars = useMemo(() => {
      const rating = item?.rating || 0;
      return Array?.from({ length: 5 }, (_, idx) => {
        const i = idx + 1;
        return (
          <Ionicons
            key={i}
            name={rating >= i ? "star" : rating >= i - 0.5 ? "star-half" : "star"}
            size={14}
            color={rating >= i - 0.5 ? COLORS?.accent : "#d1d5db"}
            style={styles?.starIcon}
          />
        );
      });
    }, [item?.rating]);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={[
          styles.card,
          showDelete && { backgroundColor: "#f8fafc", height: hp(12.5) }
        ]}
      >
        <View style={[styles.imageContainer, showDelete && { width: wp(34), height: hp(10.5) }]}>
          <Image
            source={
              IMAGE_MAP[imageSource] ||
              (imageSource ? { uri: imageSource } : { uri: "https://via.placeholder.com/150" })
            }
            style={styles.image}
            contentFit="contain"
            transition={300}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.title}
            </Text>
            {showDelete ? (
              <TouchableOpacity onPress={handleLike} activeOpacity={0.7} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleLike} activeOpacity={0.7} style={styles.likeButton}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={18}
                  color={isLiked ? COLORS.error : COLORS.darkGrey}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.starsRow}>{stars}</View>

          <View style={styles.footerRow}>
            <Text style={styles.price}>₱ {item?.price?.toFixed(2)}</Text>
            <AddButton onPress={handleAddToCart} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    flexDirection: "row",
    padding: 12,
    marginBottom: 16,
    ...SHADOWS.light,
    height: hp(15),
    alignItems: "center",
  },
  imageContainer: {
    width: wp(42),
    height: hp(12),
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "90%",
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 4,
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#161616",
    flexShrink: 1,
    marginRight: 8,
  },
  likeButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  starIcon: {
    marginRight: 2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "400",
    color: "#161616",
  },
});

export default FurnitureCardList;
