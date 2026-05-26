import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export const HomeDashboardScreen = ({ navigation }: { navigation: any }) => {
  const storeScrollRef = React.useRef<ScrollView>(null);
  
  React.useEffect(() => {
    let scrollPosition = 0;
    const intervalId = setInterval(() => {
      scrollPosition += 160; 
      // 3 cards (160 each) + view more card
      if (scrollPosition > 160 * 3) {
        scrollPosition = 0;
      }
      storeScrollRef.current?.scrollTo({ x: scrollPosition, animated: true });
    }, 3500); // Scroll every 3.5 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Top Header / Greeting Gradient Backdrop */}
      <LinearGradient colors={["#4c1d95", "#7c3aed", "#db2777"]} style={styles.headerGradient}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={24} color="#7c3aed" />
            </View>
            <Text style={styles.appName}>AstroPrecise</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingSubtitle}>AUSPICIOUS MORNING</Text>
          <Text style={styles.greetingTitle}>Namaste, Aravind</Text>
        </View>
      </LinearGradient>

      {/* Quick Actions (8 Buttons) overlapping the gradient */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionBtn} onPress={() => navigation.navigate("Charts", { screen: "KundaliInput" })}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/kundali-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText}>Kundali</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn} onPress={() => navigation.navigate("Match")}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/matching-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText}>Matching</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/mahurat-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText}>Mahurat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/horoscope-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText}>Horoscope</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/numerology-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText} numberOfLines={2}>Numerology</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/vastu-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText} numberOfLines={2}>Vastu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/ganesh-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText} numberOfLines={2}>Hindu Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <View style={[styles.quickActionIconBg, { padding: 0, backgroundColor: 'transparent', overflow: 'hidden' }]}>
            <Image 
              source={require("../../assets/images/tarot-icon.png")} 
              style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 32, transform: [{ scale: 1.45 }] }} 
            />
          </View>
          <Text style={styles.quickActionText} numberOfLines={2}>Daily Tarot</Text>
        </TouchableOpacity>
      </View>

      {/* NEW: E-Commerce Store Section (Auto-scrolling) */}
      <View style={styles.storeSection}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeTitle}>Spiritual Store <Text style={styles.storeTitleHighlight}>Featured</Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate("SpiritualStore")}>
            <Text style={styles.storeViewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={storeScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeScrollContainer}
          snapToInterval={160}
          decelerationRate="fast"
        >
          {/* Card 1 */}
          <TouchableOpacity style={styles.storeCard} onPress={() => navigation.navigate("SpiritualStore")}>
            <Image source={require("../../assets/images/store-rudraksha.png")} style={styles.storeCardImg} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.storeCardGradient} />
            <View style={styles.storeCardInfo}>
              <Text style={styles.storeCardName} numberOfLines={1}>7 Mukhi Rudraksha</Text>
              <Text style={styles.storeCardPrice}>₹2,100</Text>
            </View>
            <View style={styles.buyBadge}>
              <Text style={styles.buyBadgeText}>Buy</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.storeCard} onPress={() => navigation.navigate("SpiritualStore")}>
            <Image source={require("../../assets/images/store-sapphire.png")} style={styles.storeCardImg} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.storeCardGradient} />
            <View style={styles.storeCardInfo}>
              <Text style={styles.storeCardName} numberOfLines={1}>Yellow Sapphire</Text>
              <Text style={styles.storeCardPrice}>₹5,400</Text>
            </View>
            <View style={styles.buyBadge}>
              <Text style={styles.buyBadgeText}>Buy</Text>
            </View>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={styles.storeCard} onPress={() => navigation.navigate("SpiritualStore")}>
            <Image source={require("../../assets/images/store-yantra.png")} style={styles.storeCardImg} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.storeCardGradient} />
            <View style={styles.storeCardInfo}>
              <Text style={styles.storeCardName} numberOfLines={1}>Vastu Dosh Yantra</Text>
              <Text style={styles.storeCardPrice}>₹1,500</Text>
            </View>
            <View style={styles.buyBadge}>
              <Text style={styles.buyBadgeText}>Buy</Text>
            </View>
          </TouchableOpacity>
          
          {/* View More Card */}
          <TouchableOpacity style={[styles.storeCard, styles.storeViewMoreCard]} onPress={() => navigation.navigate("SpiritualStore")}>
            <View style={styles.storeViewMoreIconBg}>
              <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
            </View>
            <Text style={styles.storeViewMoreText}>Explore{'\n'}Store</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>



      {/* Spiritual Store Banner */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.serviceBanner} onPress={() => navigation.navigate("SpiritualStore")}>
          <LinearGradient colors={["#db2777", "#be185d"]} style={styles.serviceBannerGradient}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.serviceBannerIcon}>
                <MaterialIcons name="storefront" size={24} color="#db2777" />
              </View>
              <View>
                <Text style={[styles.serviceTitle, { color: "#ffffff" }]}>Gemstone Store</Text>
                <Text style={[styles.serviceDesc, { color: "rgba(255,255,255,0.9)" }]}>Authentic astrological remedies</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Featured Consultation */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.consultBanner}>
          <View style={{ width: "70%" }}>
            <Text style={styles.consultTitle}>Clarity awaits your cosmic path.</Text>
            <Text style={styles.consultDesc}>Connect with our Vedic masters.</Text>
            <TouchableOpacity style={styles.consultButton}>
              <MaterialIcons name="support-agent" size={18} color="#d97706" style={{ marginRight: 8 }} />
              <Text style={styles.consultButtonText}>Book Consultation</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Cosmic background
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingSection: {},
  greetingSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 1,
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: -32,
    marginBottom: 24,
    gap: 16,
  },
  quickActionBtn: {
    alignItems: "center",
    width: "20%",
    minWidth: 72,
    marginBottom: 8,
  },
  quickActionIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 8,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
  },
  
  // E-Commerce Store Section Styles
  storeSection: {
    marginBottom: 24,
  },
  storeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  storeTitleHighlight: {
    color: "#7c3aed",
  },
  storeViewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#db2777",
  },
  storeScrollContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  storeCard: {
    width: 144,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
    elevation: 4,
    shadowColor: "#1e293b",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  storeCardImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  storeCardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  storeCardInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  storeCardName: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  storeCardPrice: {
    color: "#fcd34d",
    fontWeight: "700",
    fontSize: 13,
  },
  buyBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  buyBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  storeViewMoreCard: {
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  storeViewMoreIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  storeViewMoreText: {
    color: "#475569",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },

  cosmicDataGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  moonPhaseCard: {
    width: "48%",
    borderRadius: 20,
    padding: 16,
    elevation: 6,
    shadowColor: "#1e293b",
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  moonPhaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  moonPhaseTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  moonPhaseContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  moonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fcd34d",
    overflow: "hidden",
    position: "relative",
  },
  moonWaxingShadow: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  moonPhaseName: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  moonPhaseSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginTop: 2,
  },
  luckyElementsCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    elevation: 6,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  luckyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 12,
  },
  luckyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  luckyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  luckyLabel: {
    fontSize: 11,
    color: "#64748b",
    marginRight: 4,
  },
  luckyValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1e293b",
  },
  panchangCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 20,
    elevation: 6,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 24,
  },
  panchangHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  panchangTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  panchangLocationBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  panchangLocationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  panchangGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  panchangCol: {
    flex: 1,
  },
  panchangLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  panchangValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  panchangSub: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },
  rahuKaalBanner: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rahuKaalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#991b1b",
  },
  rahuKaalTime: {
    fontSize: 13,
    color: "#b91c1c",
  },
  rahuKaalBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rahuKaalBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  mantraCard: {
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 20,
    marginBottom: 24,
    elevation: 6,
    shadowColor: "#f59e0b",
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  mantraHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mantraHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#92400e",
    marginLeft: 8,
    letterSpacing: 1,
  },
  mantraSanskrit: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#78350f",
    marginBottom: 8,
  },
  mantraMeaning: {
    fontSize: 14,
    color: "#92400e",
    fontStyle: "italic",
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c3aed",
  },
  horoscopeScroll: {
    gap: 16,
    paddingRight: 24,
  },
  horoscopeCard: {
    width: 140,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginRight: 16,
  },
  horoscopeCardActive: {
    elevation: 8,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.25,
  },
  horoscopeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  horoscopeDates: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    marginBottom: 12,
  },
  horoscopePrediction: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
  },
  serviceBanner: {
    width: "100%",
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#db2777",
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  serviceBannerGradient: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceDesc: {
    fontSize: 14,
    marginTop: 4,
  },
  consultBanner: {
    borderRadius: 20,
    padding: 24,
    minHeight: 180,
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#f59e0b",
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  consultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: 32,
    marginBottom: 16,
  },
  consultDesc: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 20,
  },
  consultButton: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  consultButtonText: {
    color: "#d97706",
    fontSize: 14,
    fontWeight: "bold",
  },
});
