import React, { useEffect, useCallback, useMemo, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { RootState } from "../redux/store";
import {
  setFurnitureItems,
  setLoading,
  setError,
  setSearchQuery,
  toggleViewMode,
} from "../redux/slices/furnitureSlice";
import { toggleLike } from "../redux/slices/likesSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { fetchFurnitureList } from "../api/services";
import COLORS from "../constants/colors";
import { SIZES, SHADOWS } from "../constants/theme";
import SearchBar from "../components/SearchBar";
import FurnitureCardGrid from "../components/FurnitureCardGrid";
import FurnitureCardList from "../components/FurnitureCardList";

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const netInfo = useNetInfo();
  const isOffline = netInfo.isConnected === false;
  const sectionListRef = useRef<SectionList>(null);

  
  const { items, total, loading, error, searchQuery, viewMode } = useSelector(
    (state: RootState) => state.furniture,
  );
  const likedIds = useSelector((state: RootState) => state.likes.likedIds);

  
  const loadFurniture = useCallback(
    async (isRefreshing: boolean = false) => {
      if (!isRefreshing && items.length === 0) {
        dispatch(setLoading(true));
      }
      dispatch(setError(null));
      try {
        const response = await fetchFurnitureList(0, 200); 
        const rawProducts = response?.data?.products || [];
        const totalCount = response?.data?.total || 0;

        const products = rawProducts?.map((p: any) => {
          const dateStr = p.date || new Date().toISOString();
          return {
            ...p,
            id: String(p.id),
            date: dateStr,
          };
        });

        dispatch(
          setFurnitureItems({
            items: products,
            total: totalCount,
            skip: 0,
          }),
        );
      } catch (err: any) {
        dispatch(setError(err?.message || "Failed to load furniture data."));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, items.length],
  );

  useEffect(() => {
    if (isFocused) {
      loadFurniture();
    }
  }, [isFocused, loadFurniture]);

  
  const filteredItems = useMemo(() => {
    const itemsArray = Array.isArray(items) ? items : [];
    return itemsArray.filter((item) => {
      return (
        item?.title
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase() || "") ?? false
      );
    });
  }, [items, searchQuery]);

  
  const totalProductsCount = filteredItems?.length || 0;

  
  const handleLikePress = useCallback(
    (id: string) => {
      dispatch(toggleLike(id));
    },
    [dispatch],
  );

  const handleAddToCartPress = useCallback(
    (id: string) => {
      dispatch(addToCart(id));
    },
    [dispatch],
  );

  const handleCardPress = useCallback(
    (item: any) => {
      navigation.navigate("ProductDetail", { item });
    },
    [navigation],
  );

  const handleSearchChange = useCallback(
    (text: string) => {
      dispatch(setSearchQuery(text));
    },
    [dispatch],
  );

  const handleToggleView = useCallback(() => {
    dispatch(toggleViewMode());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    try {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: true,
        viewPosition: 0,
      });
    } catch (e) {
      
    }
    loadFurniture(true);
  }, [loadFurniture]);

  
  const groupedSections = useMemo(() => {
    const groups: Record<string, typeof items> = {};

    (filteredItems || [])?.forEach((product) => {
      if (!product) return;
      const dateObj = product.date ? new Date(product.date) : new Date();
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let title = "";
      if (dateObj.toDateString() === today.toDateString()) {
        title = "Today";
      } else if (dateObj.toDateString() === yesterday.toDateString()) {
        title = "Yesterday";
      } else {
        const day = dateObj.getDate();
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        const currentYear = new Date().getFullYear();
        title = year === currentYear ? `${day} ${month}` : `${day} ${month} ${year}`;
      }

      if (!groups[title]) {
        groups[title] = [];
      }
      groups[title]?.push(product);
    });

    const sections = Object.keys(groups)?.map((title) => {
      const data = groups[title];
      return { title, data };
    });

    
    const getSectionTimestamp = (section: any) => {
      const firstItem = section.data[0];
      const product = Array.isArray(firstItem) ? firstItem[0] : firstItem;
      return product?.date ? new Date(product.date).getTime() : 0;
    };

    
    sections?.sort((a, b) => {
      return getSectionTimestamp(b) - getSectionTimestamp(a);
    });

    
    if (viewMode === "list") {
      return sections;
    }

    return sections?.map((section) => {
      const chunkedData = [];
      const dataArray = section.data || [];
      for (let i = 0; i < dataArray?.length; i += 2) {
        chunkedData?.push(dataArray?.slice(i, i + 2));
      }
      return {
        ...section,
        data: chunkedData,
      };
    });
  }, [filteredItems, viewMode]);

  
  const renderSectionHeader = useCallback(
    ({ section: { title } }: any) => (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
    ),
    [],
  );

  
  const renderSectionItem = useCallback(
    ({ item }: { item: any }) => {
      if (viewMode === "list") {
        const isLiked = likedIds.includes(item.id);
        return (
          <FurnitureCardList
            item={item}
            isLiked={isLiked}
            onLikePress={handleLikePress}
            onAddToCartPress={handleAddToCartPress}
            onPress={handleCardPress}
          />
        );
      } else {
        
        return (
          <View style={styles.gridRow}>
            {item?.map((prod: any) => {
              const isLiked = likedIds?.includes(prod.id);
              return (
                <FurnitureCardGrid
                  key={prod.id}
                  item={prod}
                  isLiked={isLiked}
                  onLikePress={handleLikePress}
                  onAddToCartPress={handleAddToCartPress}
                  onPress={handleCardPress}
                />
              );
            })}
            
            {item.length === 1 && <View style={styles.gridPlaceholder} />}
          </View>
        );
      }
    },
    [
      viewMode,
      likedIds,
      handleLikePress,
      handleAddToCartPress,
      handleCardPress,
    ],
  );

  return (
    <ScreenWrapper disableBottomInset={true}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.iconButton}>
            <Ionicons
              name="refresh-outline"
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar value={searchQuery} onChangeText={handleSearchChange} />
          </View>

          <TouchableOpacity
            onPress={handleToggleView}
            activeOpacity={0.7}
            style={styles.toggleButton}
          >
            <Ionicons
              name={viewMode === "grid" ? "grid-outline" : "list-outline"}
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        
        {loading && items.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.infoText}>Loading latest products...</Text>
          </View>
        ) : error && items.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={COLORS.error}
            />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems?.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons
              name={isOffline ? "wifi-outline" : "search-outline"}
              size={48}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoText}>
              {isOffline
                ? "You are offline. No cached products are available."
                : "No products found matching your search."}
            </Text>
          </View>
        ) : (
          
          <SectionList
            ref={sectionListRef}
            key={viewMode}
            sections={groupedSections as any}
            keyExtractor={(item, index) =>
              viewMode === "list" ? String(item.id) : String(index)
            }
            renderItem={renderSectionItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            ListHeaderComponent={
              <View style={styles.totalRow}>
                <Text style={styles.totalCountText}>
                  Total: {total} Products
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  iconButton: {
    padding: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  searchBarWrapper: {
    flex: 1,
    marginRight: 12,
  },
  toggleButton: {
    backgroundColor: COLORS.white,
    height: 52,
    width: 52,
    borderRadius: SIZES.radiusLg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  infoText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.error,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: SIZES.radiusRound,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 80,
  },
  totalRow: {
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  totalCountText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  sectionHeaderContainer: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: COLORS.background,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gridPlaceholder: {
    width: (Dimensions.get("window").width - 48) / 2,
    backgroundColor: "transparent",
  },
  footerLoader: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  noMoreText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  offlineToast: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.medium,
  },
  offlineToastText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
});

export default HomeScreen;
