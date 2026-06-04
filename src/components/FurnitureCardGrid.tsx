import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { FurnitureItem } from "../redux/slices/furnitureSlice";
import COLORS from "../constants/colors";
import { SIZES, SHADOWS } from "../constants/theme";
import IMAGE_MAP from "../constants/images";
import { hp } from "../utils/responsive";
import AddButton from "./AddButton";

interface FurnitureCardGridProps {
  item: FurnitureItem;
  isLiked: boolean;
  onLikePress: (id: string) => void;
  onAddToCartPress: (id: string) => void;
  onPress?: (item: FurnitureItem) => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export const FurnitureCardGrid: React.FC<FurnitureCardGridProps> = React.memo(
  ({ item, isLiked, onLikePress, onAddToCartPress, onPress }) => {
    const handlePress = () => onPress?.(item);
    const handleLike = () => onLikePress(String(item.id));
    const handleAddToCart = () => onAddToCartPress(String(item.id));
    const imageSource = item?.thumbnail || (item?.images && item?.images[0]) || item?.image || "";

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={styles.ratingText}>{(item.rating || 0).toFixed(1)}</Text>
          </View>
          <TouchableOpacity onPress={handleLike} activeOpacity={0.7} style={styles.likeButton}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={18}
              color={isLiked ? COLORS.error : COLORS.darkGrey}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={
              (imageSource ? { uri: imageSource } : { uri: "https://via.placeholder.com/150" })
            }
            style={styles.image}
            contentFit="contain"
            transition={300}
          />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item?.title}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>₱ {item.price.toFixed(2)}</Text>
            <AddButton onPress={handleAddToCart} />
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    width: CARD_WIDTH,
    padding: 12,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 3,
  },
  likeButton: {
    padding: 2,
  },
  imageContainer: {
    height: hp(12),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
});

export default FurnitureCardGrid;
