import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export function CategoryProductsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoryTitle, products } = route.params || { categoryTitle: "Products", products: [] };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#312e81", "#4f46e5"]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={18} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        <TouchableOpacity style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={22} color="#ffffff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.productGrid}>
          {products.map((item: any, index: number) => (
            <View key={index} style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image source={typeof item.img === 'string' ? { uri: item.img } : item.img} style={styles.productImage} />
                <LinearGradient colors={['rgba(0,0,0,0.3)', 'transparent']} style={styles.productImageGradient} />
                <TouchableOpacity style={styles.favoriteButton}>
                  <MaterialIcons name="favorite" size={16} color="#e2e8f0" />
                </TouchableOpacity>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={12} color="#f59e0b" />
                  <Text style={styles.ratingText}>4.9 (128)</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  <TouchableOpacity style={styles.addButton}>
                    <LinearGradient colors={["#db2777", "#be185d"]} style={styles.addButtonGradient}>
                      <MaterialIcons name="add" size={18} color="#ffffff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: "#4338ca",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4f46e5",
  },
  cartBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f1f5f9",
    position: "relative",
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
  favoriteButton: {
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
    padding: 16,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 4,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#4f46e5",
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#db2777",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  }
});
