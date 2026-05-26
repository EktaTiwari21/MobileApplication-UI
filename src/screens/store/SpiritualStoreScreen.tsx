import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const CATEGORIES_DATA = [
  {
    title: "VASTU",
    icon: require("../../../assets/categories/vastu_category_icon_1779013029764.png"),
    subItems: [
      { name: "Energy Vastu", price: "₹2,100", img: require("../../../assets/categories/test_product_1_1779089058118.png") },
      { name: "Metal Strip", price: "₹1,500", img: require("../../../assets/categories/prod_vastu_metal_strip_1779089149894.png") },
      { name: "Color Tape", price: "₹850", img: require("../../../assets/categories/prod_vastu_color_tape_1779089165014.png") },
      { name: "Helix", price: "₹3,400", img: require("../../../assets/categories/prod_vastu_helix_1779089185416.png") },
    ]
  },
  {
    title: "CRYSTAL",
    icon: require("../../../assets/categories/crystal_category_icon_1779013045789.png"),
    subItems: [
      { name: "Necklace", price: "₹1,800", img: require("../../../assets/categories/prod_crystal_necklace_1779089332850.png") },
      { name: "Mala", price: "₹1,200", img: require("../../../assets/categories/prod_crystal_mala_1779089202743.png") },
      { name: "Tree", price: "₹2,500", img: require("../../../assets/categories/prod_crystal_tree_1779089219425.png") },
      { name: "Chips", price: "₹450", img: require("../../../assets/categories/prod_crystal_chips_1779089237699.png") },
    ]
  },
  {
    title: "BRACELET",
    icon: require("../../../assets/categories/bracelet_category_icon_1779013062098.png"),
    subItems: [
      { name: "Shapes", price: "₹950", img: require("../../../assets/categories/prod_bracelet_shapes_1779089254698.png") },
      { name: "Manifest", price: "₹1,250", img: require("../../../assets/categories/prod_bracelet_manifest_1779089271583.png") },
      { name: "Certified", price: "₹3,100", img: require("../../../assets/categories/prod_bracelet_certified_1779089293026.png") },
      { name: "Zodiac", price: "₹1,600", img: require("../../../assets/categories/prod_bracelet_zodiac_1779089309096.png") },
    ]
  },
  {
    title: "RUDRAKSHA",
    icon: require("../../../assets/categories/rudraksha_category_icon_1779013077514.png"),
    subItems: [
      { name: "Pendant", price: "₹2,400", img: require("../../../assets/categories/prod_rudraksha_pendant_1779089348491.png") },
      { name: "Mala", price: "₹5,500", img: require("../../../assets/categories/prod_rudraksha_mala_1779089367910.png") },
      { name: "Kavach", price: "₹3,200", img: require("../../../assets/categories/prod_rudraksha_kavach_1779089388298.png") },
      { name: "Bracelet", price: "₹1,800", img: require("../../../assets/categories/prod_bracelet_certified_1779089293026.png") }, // Reused
    ]
  },
  {
    title: "YANTRA",
    icon: require("../../../assets/categories/cat_yantra_icon_1779089118359.png"),
    subItems: [
      { name: "Wooden", price: "₹1,100", img: require("../../../assets/categories/cat_yantra_icon_1779089118359.png") },
      { name: "Golden", price: "₹4,500", img: require("../../../assets/categories/cat_yantra_icon_1779089118359.png") },
      { name: "Panchdhatu", price: "₹2,800", img: require("../../../assets/categories/cat_yantra_icon_1779089118359.png") },
      { name: "Copper", price: "₹1,500", img: require("../../../assets/categories/cat_yantra_icon_1779089118359.png") },
    ]
  },
  {
    title: "PENDANTS",
    icon: require("../../../assets/categories/cat_pendant_icon_1779089136282.png"),
    subItems: [
      { name: "Pencil", price: "₹850", img: require("../../../assets/categories/cat_pendant_icon_1779089136282.png") },
      { name: "Heart", price: "₹1,200", img: require("../../../assets/categories/cat_pendant_icon_1779089136282.png") },
      { name: "Frame", price: "₹1,600", img: require("../../../assets/categories/prod_rudraksha_pendant_1779089348491.png") },
      { name: "7-Chakra", price: "₹1,950", img: require("../../../assets/categories/prod_crystal_necklace_1779089332850.png") },
    ]
  }
];

// Combine all sub-items into a single list for "Trending Products"
const TRENDING_PRODUCTS = CATEGORIES_DATA.flatMap(c => c.subItems).slice(0, 6);

export const SpiritualStoreScreen = ({ navigation }: { navigation: any }) => {
  const handleCategoryPress = (category: any) => {
    navigation.navigate("CategoryProducts", { 
      categoryTitle: category.title,
      products: category.subItems 
    });
  };

  return (
    <View style={styles.container}>
      {/* Aesthetic Top Header */}
      <LinearGradient colors={["#312e81", "#4338ca", "#4f46e5"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>AstroMarket</Text>
            <Text style={styles.brandSubtitle}>Premium Spiritual Goods</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="shopping-cart" size={24} color="#ffffff" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Glassmorphic Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color="#475569" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for Rudraksha, Crystals..."
            placeholderTextColor="#64748b"
          />
          <TouchableOpacity style={styles.micButton}>
            <MaterialIcons name="mic" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Horizontal Category List */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {CATEGORIES_DATA.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryIconContainer}>
                  <Image source={typeof category.icon === 'string' ? { uri: category.icon } : category.icon} style={styles.categoryIcon} />
                </View>
                <Text style={styles.categoryText}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promotional Carousel with modern drop shadow */}
        <View style={styles.promoSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
            <LinearGradient colors={["#f59e0b", "#f97316"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.promoBanner}>
              <View style={styles.promoContent}>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>FLASH SALE</Text>
                </View>
                <Text style={styles.promoTitle}>Up to 50% Off</Text>
                <Text style={styles.promoSubtitle}>On Certified Rudraksha</Text>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
              <Image source={require("../../../assets/categories/prod_rudraksha_mala_1779089367910.png")} style={styles.promoImage} />
            </LinearGradient>

            <LinearGradient colors={["#8b5cf6", "#ec4899"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.promoBanner}>
              <View style={styles.promoContent}>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>NEW ARRIVALS</Text>
                </View>
                <Text style={styles.promoTitle}>Healing Crystals</Text>
                <Text style={styles.promoSubtitle}>Find your inner peace</Text>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Explore</Text>
                </TouchableOpacity>
              </View>
              <Image source={require("../../../assets/categories/prod_crystal_tree_1779089219425.png")} style={styles.promoImage} />
            </LinearGradient>
          </ScrollView>
        </View>

        {/* Deals of the Day / Trending Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Products</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="arrow-forward-ios" size={12} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <View style={styles.trendingGrid}>
          {TRENDING_PRODUCTS.map((product, idx) => (
            <TouchableOpacity key={idx} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Image source={typeof product.img === 'string' ? { uri: product.img } : product.img} style={styles.productImage} />
                <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.productImageGradient} />
                <View style={styles.favoriteBtn}>
                  <MaterialIcons name="favorite" size={16} color="#e2e8f0" />
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={12} color="#f59e0b" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.oldPrice}>
                    ₹{parseInt(product.price.replace(/[^\d]/g, '')) + 500}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Shop by Categories Grid (Alternate view) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Categories</Text>
        </View>
        <View style={styles.shopCategoryGrid}>
          {CATEGORIES_DATA.map((cat, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.shopCategoryCard}
              onPress={() => handleCategoryPress(cat)}
            >
              <Image source={typeof cat.icon === 'string' ? { uri: cat.icon } : cat.icon} style={styles.shopCategoryImg} />
              <LinearGradient 
                colors={["transparent", "rgba(15,23,42,0.9)"]} 
                style={styles.shopCategoryOverlay}
              >
                <Text style={styles.shopCategoryText}>{cat.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: "#4338ca",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brandContainer: {
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: "#c7d2fe",
    fontWeight: "500",
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#ef4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4338ca",
  },
  cartBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "500",
  },
  micButton: {
    backgroundColor: "#4f46e5",
    padding: 6,
    borderRadius: 8,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  categoriesSection: {
    backgroundColor: "transparent",
    paddingVertical: 20,
    marginBottom: 4,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 20,
  },
  categoryItem: {
    alignItems: "center",
    width: 68,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  categoryIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
  },
  promoSection: {
    marginBottom: 20,
  },
  promoBanner: {
    width: 340,
    height: 170,
    marginHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  promoContent: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  promoBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 10,
  },
  promoBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 6,
  },
  promoSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
    fontWeight: "500",
  },
  promoButton: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promoButtonText: {
    color: "#1e293b",
    fontWeight: "800",
    fontSize: 12,
  },
  promoImage: {
    width: 150,
    height: "100%",
    resizeMode: "cover",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4f46e5",
    marginRight: 4,
  },
  trendingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  productImageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    backgroundColor: "#f8fafc",
  },
  productImageGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 40,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 4,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#4f46e5",
  },
  oldPrice: {
    fontSize: 12,
    color: "#94a3b8",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  shopCategoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  shopCategoryCard: {
    width: "48%",
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  shopCategoryImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  shopCategoryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 14,
  },
  shopCategoryText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.5,
  }
});
