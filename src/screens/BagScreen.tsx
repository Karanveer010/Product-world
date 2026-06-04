import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import ScreenWrapper from "../components/ScreenWrapper";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity, clearCart } from "../redux/slices/cartSlice";
import { incrementOrdersCount } from "../redux/slices/userDataSlice";
import COLORS from "../constants/colors";
import { SIZES, SHADOWS } from "../constants/theme";
import IMAGE_MAP from "../constants/images";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";

export const BagScreen = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const furnitureItems = useSelector((state: RootState) => state.furniture.items);

  const detailedCartItems = cartItems
    ?.map((cartItem) => {
      const details = furnitureItems.find((p) => p.id === cartItem.id);
      return details ? { ...details, quantity: cartItem.quantity } : null;
    })
    ?.filter((item): item is NonNullable<typeof item> => item !== null);

  const totalAmount = detailedCartItems.reduce(
    (sum, item) => sum + item?.price * item.quantity,
    0
  );

  const handleIncrement = useCallback(
    (id: string, currentQty: number) => {
      dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
    },
    [dispatch]
  );

  const handleDecrement = useCallback(
    (id: string, currentQty: number) => {
      if (currentQty <= 1) {
        dispatch(removeFromCart(id));
      } else {
        dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
      }
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeFromCart(id));
    },
    [dispatch]
  );

  const handleCheckout = () => {
    Alert.alert(
      "Checkout Success",
      `Thank you for your purchase! Total: ₱ ${totalAmount.toFixed(2)}`,
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(incrementOrdersCount());
            dispatch(clearCart());
          },
        },
      ]
    );
  };

  const renderItem = useCallback(({ item }: { item: typeof detailedCartItems[0] }) => {
    const imageSource = item.thumbnail || (item.images && item.images[0]) || item.image || "";
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={
              IMAGE_MAP[imageSource] ||
              (imageSource ? { uri: imageSource } : { uri: "https://via.placeholder.com/150" })
            }
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </View>

        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.title}
            </Text>
            <TouchableOpacity onPress={() => handleRemove(String(item.id))} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>₱ {item.price.toFixed(2)}</Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              onPress={() => handleDecrement(String(item.id), item.quantity)}
              style={styles.qtyBtn}
            >
              <Ionicons name="remove" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => handleIncrement(String(item.id), item.quantity)}
              style={styles.qtyBtn}
            >
              <Ionicons name="add" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [handleRemove, handleDecrement, handleIncrement]);

  return (
    <ScreenWrapper disableBottomInset={true}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Shopping Bag</Text>

        {detailedCartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Your shopping bag is empty.</Text>
            <Text style={styles.subText}>Explore the latest products and add products to your bag.</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={detailedCartItems}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.checkoutSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>₱ {totalAmount.toFixed(2)}</Text>
              </View>
              <Button
                title="Proceed to Checkout"
                onPress={handleCheckout}
                style={styles.checkoutBtn}
                textStyle={styles.checkoutBtnText}
              />
            </View>
          </>
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
    paddingBottom: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    ...SHADOWS.light,
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyLight,
    borderRadius: SIZES.radiusMd,
  },
  image: {
    width: "90%",
    height: "90%",
  },
  details: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyLight,
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
  checkoutSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radiusRound,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
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
    fontWeight: "500",
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

export default BagScreen;
