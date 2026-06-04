import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenWrapper from "../components/ScreenWrapper";
import { wp, hp } from "../utils/responsive";
import { addToCart, updateQuantity } from "../redux/slices/cartSlice";
import COLORS from "../constants/colors";
import { SHADOWS } from "../constants/theme";
import IMAGE_MAP from "../constants/images";
import { Ionicons } from "@expo/vector-icons";
import { fetchProductDetail } from "../api/services";

const { width } = Dimensions.get("window");

export const ProductDetailScreen = ({ route }: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { item: routeItem } = route.params;
  const [item, setItem] = useState(routeItem);
  const [detailLoading, setDetailLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  let price = item?.price || routeItem?.price || "0.00"

  
  const loadDetail = useCallback(async () => {
    if (!routeItem?.id) return;
    setDetailLoading(true);
    try {
      const response = await fetchProductDetail(routeItem?.id);
      if (response?.status == 200) {
        const responseData = response?.data?.[0];
        
        setItem(responseData);
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.log("Error loading product detail:", error);
    } finally {
      setDetailLoading(false);
    }
  }, [routeItem?.id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const imagesList = useMemo(() => {
    let list: string[] = [];
    if (Array?.isArray(item?.images) && item?.images?.length > 0) {
      list = [...item?.images];

    } else {
      const singleImage = item?.thumbnail || item?.image;
      if (singleImage) {
        list = [singleImage];
      }
    }
    
    if (list?.length === 1) {
      list = [list[0], list[0], list[0]];
    } else if (list?.length === 2) {
      list = [list[0], list[1], list[0]];
    }
    return list;
  }, [item]);

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    if (slideSize <= 0) return;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math?.round(index);
    if (roundIndex !== activeImageIndex) {
      setActiveImageIndex(roundIndex);
    }
  };

  const handleIncrement = () => {
    setQty((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const handleAddToBag = () => {
    dispatch(addToCart(item.id));
    if (qty > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: qty }));
    }
    Alert.alert("Success", `Added ${qty} ${item.title} to your bag.`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart(item.id));
    if (qty > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: qty }));
    }
    navigation.navigate("MainApp", { screen: "Bag" });
  };


  return (
    <ScreenWrapper disableTopInset={true} disableBottomInset={true}>
      
      <View style={styles.imageSection}>
        
        <FlatList
          data={imagesList}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: img }) => (
            <View style={styles.imageWrapper}>
              <Image
                source={
                  img
                    ? { uri: img }
                    : { uri: "https://via.placeholder.com/300" }
                }
                style={styles.image}
                cachePolicy="memory-disk"
                contentFit="contain"
                transition={300}
              />
            </View>
          )}
        />

        <View style={[styles.safeHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>

      
      <View style={styles.detailsSection}>
        {imagesList?.length > 1 && (
          <View style={styles.pagination}>
            {imagesList?.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeImageIndex ? styles.dotActive : null,
                ]}
              />
            ))}
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          <View style={styles.infoRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{item?.title}</Text>
              <Text style={styles.category}>{item?.category || "Sofa"}</Text>
            </View>

            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>₱ {price ? Number(price)?.toFixed(2) : "0.00"}</Text>

              
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  activeOpacity={0.8}
                  style={styles.qtyBtn}
                >
                  <Ionicons name="remove" size={20} color={COLORS.black} />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{qty}</Text>

                <TouchableOpacity
                  onPress={handleIncrement}
                  activeOpacity={0.8}
                  style={[styles.qtyBtn, styles.qtyBtnActive]}
                >
                  <Ionicons name="add" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {item?.description ||
              "Three-seat sofas are best for living room and family room spaces. It is about 90 inches wide in the seating area, 38 inches deep, and 34 inches high."}
          </Text>
        </ScrollView>

        
        <View
          style={[
            styles.footerRow,
            { paddingBottom: insets?.bottom > 0 ? insets.bottom : hp(1.5) },
          ]}
        >
          
          <TouchableOpacity
            onPress={handleAddToBag}
            activeOpacity={0.8}
            style={styles.bagIconButton}
          >
            <Image
              source={IMAGE_MAP?.bag}
              style={{ width: wp(8), height: hp(3.5) }}
              contentFit="contain"
            />
          </TouchableOpacity>

          
          <TouchableOpacity
            onPress={handleBuyNow}
            activeOpacity={0.8}
            style={styles.buyNowBtn}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  imageSection: {
    height: hp(52),
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: hp(2),
  },
  carousel: {
    flex: 1,
    width: "100%",
  },
  safeHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: wp(5),
  },
  backButton: {
    padding: 8,
  },
  imageWrapper: {
    width: width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
  },
  image: {
    width: "100%",
    height: "90%",
  },
  pagination: {
    position: "absolute",
    top: hp(-6.5),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  dot: {
    width: wp(3.2),
    height: wp(3.2),
    borderRadius: wp(3.2) / 2,
    borderWidth: 0.8,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    marginHorizontal: wp(1.2),
  },
  dotActive: {
    backgroundColor: COLORS.primary, 
  },
  detailsSection: {
    
    position: "absolute",
    bottom: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    ...SHADOWS.medium,
  },
  scrollContent: {
    paddingBottom: hp(2),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleCol: {
    flex: 1,
    marginRight: wp(4),
  },
  title: {
    fontSize: hp(2.6),
    fontWeight: "600",
    color: COLORS.black,
  },
  category: {
    fontSize: hp(1.8),
    color: COLORS.textSecondary,
    marginTop: hp(0.5),
    textTransform: "capitalize",
  },
  priceCol: {
    alignItems: "flex-start",
  },
  priceLabel: {
    fontSize: hp(1.5),
    color: COLORS.textSecondary,
    marginBottom: hp(0.3),
  },
  price: {
    fontSize: hp(2.4),
    fontWeight: "bold",
    color: COLORS.black,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: hp(4),
  },
  qtyBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.black,
    borderRadius: wp(1.5),
    width: wp(9),
    height: wp(9),
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnActive: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  qtyText: {
    width: wp(10),
    fontSize: hp(2.0),
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: hp(2.0),
    fontWeight: "600",
    color: COLORS.black,
    marginTop: hp(2),
    marginBottom: hp(0.8),
  },
  description: {
    fontSize: hp(1.8),
    color: COLORS.black2,
    lineHeight: hp(2.5),
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingTop: hp(1.5),
  },
  bagIconButton: {
    width: hp(6.5),
    height: hp(6.5),
    borderRadius: hp(3.25),
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },
  buyNowBtn: {
    flex: 1,
    height: hp(6.5),
    borderRadius: wp(4),
    backgroundColor: COLORS?.accent,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },
  buyNowText: {
    fontSize: hp(2.0),
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
