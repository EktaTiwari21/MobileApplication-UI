import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useHoroscopeStore } from "../../store/useHoroscopeStore";

const { width } = Dimensions.get("window");

const zodiacSigns = [
  { name: "Aries", dates: "Mar 21 - Apr 19", icon: "gesture" },
  { name: "Taurus", dates: "Apr 20 - May 20", icon: "grain" },
  { name: "Gemini", dates: "May 21 - Jun 20", icon: "people" },
  { name: "Cancer", dates: "Jun 21 - Jul 22", icon: "waves" },
  { name: "Leo", dates: "Jul 23 - Aug 22", icon: "wb-sunny" },
  { name: "Virgo", dates: "Aug 23 - Sep 22", icon: "spa" },
  { name: "Libra", dates: "Sep 23 - Oct 22", icon: "scale" },
  { name: "Scorpio", dates: "Oct 23 - Nov 21", icon: "details" },
  { name: "Sagittarius", dates: "Nov 22 - Dec 21", icon: "navigation" },
  { name: "Capricorn", dates: "Dec 22 - Jan 19", icon: "landscape" },
  { name: "Aquarius", dates: "Jan 20 - Feb 18", icon: "opacity" },
  { name: "Pisces", dates: "Feb 19 - Mar 20", icon: "sailing" },
];

export const HoroscopeDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {
    selectedSign,
    selectedPeriod,
    forecastData,
    isLoading,
    error,
    fetchHoroscope,
    setSelectedSign,
    setSelectedPeriod,
  } = useHoroscopeStore();

  // Load selected data on mount
  useEffect(() => {
    fetchHoroscope(selectedSign, selectedPeriod);
  }, []);

  const renderStars = (rating: number, activeColor: string) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={18}
          color={i <= rating ? activeColor : "#e2e8f0"}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
        >
          <MaterialIcons name="arrow-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zodiac Horoscope</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Horizontal Zodiac Selector */}
      <View style={styles.zodiacSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zodiacStripe}>
          {zodiacSigns.map((zodiac) => {
            const isSelected = selectedSign === zodiac.name;
            return (
              <TouchableOpacity
                key={zodiac.name}
                onPress={() => setSelectedSign(zodiac.name)}
                style={[
                  styles.zodiacCard,
                  isSelected && styles.zodiacCardActive,
                ]}
              >
                <View style={[styles.zodiacIconBg, isSelected && styles.zodiacIconBgActive]}>
                  <MaterialIcons
                    name={zodiac.icon as any}
                    size={22}
                    color={isSelected ? "#ffffff" : "#7c3aed"}
                  />
                </View>
                <Text style={[styles.zodiacName, isSelected && styles.zodiacNameActive]}>
                  {zodiac.name}
                </Text>
                <Text style={[styles.zodiacDates, isSelected && styles.zodiacDatesActive]}>
                  {zodiac.dates}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Period Selection Tabs */}
      <View style={styles.tabContainer}>
        {(["daily", "weekly", "monthly", "annual"] as const).map((period) => {
          const isSelected = selectedPeriod === period;
          return (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.tab,
                isSelected && styles.tabActive,
              ]}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Aligning cosmic transits...</Text>
        </View>
      ) : error || !forecastData ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error || "Cosmic channels blocked"}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => fetchHoroscope(selectedSign, selectedPeriod)}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Sign Details Banner */}
          <View style={styles.signBanner}>
            <LinearGradient
              colors={["#7c3aed", "#db2777"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signBannerGradient}
            >
              <View style={styles.signTitleRow}>
                <Text style={styles.signTitle}>{forecastData.sign}</Text>
                <Text style={styles.signPeriodLabel}>
                  {selectedPeriod.toUpperCase()} FORECAST
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Lucky Properties Grid */}
          <View style={styles.luckyCard}>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>LUCKY NUMBER</Text>
              <Text style={[styles.luckyValue, { color: "#7c3aed" }]}>
                {forecastData.lucky_number}
              </Text>
            </View>
            <View style={[styles.luckyItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "rgba(148,163,184,0.15)" }]}>
              <Text style={styles.luckyLabel}>LUCKY COLOR</Text>
              <Text style={[styles.luckyValue, { color: "#db2777" }]}>
                {forecastData.lucky_color}
              </Text>
            </View>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>COMPATIBLE SIGN</Text>
              <Text style={[styles.luckyValue, { color: "#f59e0b" }]}>
                {forecastData.compatible_sign}
              </Text>
            </View>
          </View>

          {/* Horoscope Narrative Reading */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="explore" size={22} color="#7c3aed" />
              <Text style={styles.cardTitle}>Vedic Predictions</Text>
            </View>
            <Text style={styles.forecastText}>{forecastData.forecast}</Text>
          </View>

          {/* Sector Ratings Star Gauges */}
          <View style={[styles.card, { marginBottom: 60 }]}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="bar-chart" size={22} color="#db2777" />
              <Text style={styles.cardTitle}>Life Area Ratings</Text>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.ratingLabelGroup}>
                <MaterialIcons name="favorite" size={16} color="#db2777" />
                <Text style={styles.ratingName}>Love & Compatibility</Text>
              </View>
              <View style={styles.starsGroup}>
                {renderStars(forecastData.ratings.love, "#db2777")}
              </View>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.ratingLabelGroup}>
                <MaterialIcons name="work" size={16} color="#7c3aed" />
                <Text style={styles.ratingName}>Career & Success</Text>
              </View>
              <View style={styles.starsGroup}>
                {renderStars(forecastData.ratings.career, "#7c3aed")}
              </View>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.ratingLabelGroup}>
                <MaterialIcons name="account-balance-wallet" size={16} color="#10b981" />
                <Text style={styles.ratingName}>Wealth & Finance</Text>
              </View>
              <View style={styles.starsGroup}>
                {renderStars(forecastData.ratings.wealth, "#10b981")}
              </View>
            </View>

            <View style={[styles.ratingRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={styles.ratingLabelGroup}>
                <MaterialIcons name="favorite-border" size={16} color="#f59e0b" />
                <Text style={styles.ratingName}>Health & Energy</Text>
              </View>
              <View style={styles.starsGroup}>
                {renderStars(forecastData.ratings.health, "#f59e0b")}
              </View>
            </View>
          </View>

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 12,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
    backgroundColor: "#ffffff",
  },
  headerBackBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  zodiacSelector: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
  },
  zodiacStripe: {
    paddingHorizontal: 16,
    gap: 12,
  },
  zodiacCard: {
    width: 90,
    height: 110,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  zodiacCardActive: {
    backgroundColor: "#7c3aed",
    shadowColor: "#7c3aed",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  zodiacIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(124,58,237,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  zodiacIconBgActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  zodiacName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e293b",
  },
  zodiacNameActive: {
    color: "#ffffff",
  },
  zodiacDates: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  zodiacDatesActive: {
    color: "rgba(255,255,255,0.7)",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 99,
  },
  tabActive: {
    backgroundColor: "rgba(124,58,237,0.08)",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#7c3aed",
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 20,
  },
  signBanner: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  signBannerGradient: {
    padding: 24,
  },
  signTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  signPeriodLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.8,
  },
  luckyCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  luckyItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  luckyLabel: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  luckyValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  forecastText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.06)",
    paddingVertical: 12,
  },
  ratingLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  starsGroup: {
    flexDirection: "row",
  },
});
