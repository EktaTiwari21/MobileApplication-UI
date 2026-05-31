import React, { useEffect, useState } from "react";
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
import { usePanchangStore, TimeSlot } from "../../store/usePanchangStore";

const { width } = Dimensions.get("window");

export const PanchangDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const {
    selectedDate,
    panchangData,
    isLoading,
    error,
    setSelectedDateAndFetch,
  } = usePanchangStore();

  const [activeGridTab, setActiveGridTab] = useState<"choghadiya" | "hora">("choghadiya");
  const [dayNightTab, setDayNightTab] = useState<"day" | "night">("day");

  // Load today's data on startup
  useEffect(() => {
    if (!panchangData || panchangData.date !== selectedDate) {
      setSelectedDateAndFetch(selectedDate);
    }
  }, [selectedDate]);

  // Generate 7-day date slider data (around selectedDate)
  const getDateStripe = () => {
    const dates = [];
    const base = new Date(selectedDate);
    // Show 3 days before and 3 days after
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      dates.push({
        dateStr,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return dates;
  };

  const getAuspiciousQualityColor = (quality: string) => {
    if (quality === "Auspicious") return "#10b981";
    if (quality === "Moderate") return "#f59e0b";
    return "#ef4444";
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
        <Text style={styles.headerTitle}>Vedic Panchang</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Date Stripe Horizontal Selector */}
      <View style={styles.dateSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStripe}>
          {getDateStripe().map((item) => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <TouchableOpacity
                key={item.dateStr}
                onPress={() => setSelectedDateAndFetch(item.dateStr)}
                style={[
                  styles.datePill,
                  isSelected && styles.datePillActive,
                ]}
              >
                <Text style={[styles.dateDayText, isSelected && styles.dateDayTextActive]}>
                  {item.dayName}
                </Text>
                <Text style={[styles.dateNumberText, isSelected && styles.dateNumberTextActive]}>
                  {item.dayNum}
                </Text>
                <Text style={[styles.dateMonthText, isSelected && styles.dateMonthTextActive]}>
                  {item.monthName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Aligning solar-lunar positions...</Text>
        </View>
      ) : error || !panchangData ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="cloud-off" size={48} color="#94a3b8" />
          <Text style={styles.errorText}>{error || "Failed to load Panchang"}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setSelectedDateAndFetch(selectedDate)}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Day Sunrise / Sunset Timings Row */}
          <View style={styles.solarRow}>
            <View style={styles.solarCard}>
              <MaterialIcons name="wb-sunny" size={24} color="#f59e0b" />
              <View style={styles.solarInfo}>
                <Text style={styles.solarLabel}>SUNRISE</Text>
                <Text style={styles.solarValue}>{panchangData.sunrise}</Text>
              </View>
            </View>
            <View style={styles.solarCard}>
              <MaterialIcons name="nights-stay" size={24} color="#7c3aed" />
              <View style={styles.solarInfo}>
                <Text style={styles.solarLabel}>SUNSET</Text>
                <Text style={styles.solarValue}>{panchangData.sunset}</Text>
              </View>
            </View>
          </View>

          {/* Vrats / Festivals Banner Card */}
          <View style={styles.festCard}>
            <LinearGradient
              colors={["#7c3aed", "#db2777"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.festGradient}
            >
              <View style={styles.festIconBg}>
                <MaterialIcons name="temple-hindu" size={24} color="#ffffff" />
              </View>
              <View style={styles.festContent}>
                <Text style={styles.festSub}>FESTIVALS & VRATS TODAY</Text>
                {panchangData.festivals.map((fest, idx) => (
                  <Text key={idx} style={styles.festTitle}>
                    {fest}
                  </Text>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Primary Elements Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="brightness-low" size={22} color="#7c3aed" />
              <Text style={styles.cardTitle}>Vedic Elements</Text>
            </View>

            <View style={styles.panchangGrid}>
              <View style={styles.panchangGridRow}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>TITHI (LUNAR DAY)</Text>
                  <Text style={styles.gridValue}>{panchangData.tithi}</Text>
                  <Text style={styles.gridSub}>Ends at {panchangData.tithi_end_time}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>NAKSHATRA (CONSTELLATION)</Text>
                  <Text style={styles.gridValue}>{panchangData.nakshatra}</Text>
                  <Text style={styles.gridSub}>Ends at {panchangData.nakshatra_end_time}</Text>
                </View>
              </View>

              <View style={[styles.panchangGridRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>YOGA</Text>
                  <Text style={styles.gridValue}>{panchangData.yoga}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>KARANA</Text>
                  <Text style={styles.gridValue}>{panchangData.karana}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Muhurat Windows (Rahu Kaal / Abhijit) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="alarm" size={22} color="#db2777" />
              <Text style={styles.cardTitle}>Cosmic Windows</Text>
            </View>

            <View style={styles.windowRow}>
              <View style={[styles.windowIndicator, { backgroundColor: "#fee2e2" }]} />
              <View style={styles.windowContent}>
                <Text style={[styles.windowLabel, { color: "#b91c1c" }]}>Rahu Kaal (Avoid Karyas)</Text>
                <Text style={styles.windowTime}>{panchangData.rahu_kaal}</Text>
              </View>
            </View>

            <View style={styles.windowRow}>
              <View style={[styles.windowIndicator, { backgroundColor: "#d1fae5" }]} />
              <View style={styles.windowContent}>
                <Text style={[styles.windowLabel, { color: "#065f46" }]}>Abhijit Muhurat (Auspicious)</Text>
                <Text style={styles.windowTime}>{panchangData.abhijit_muhurat}</Text>
              </View>
            </View>

            <View style={styles.windowRow}>
              <View style={[styles.windowIndicator, { backgroundColor: "#fef3c7" }]} />
              <View style={styles.windowContent}>
                <Text style={[styles.windowLabel, { color: "#92400e" }]}>Gulika Kaal (Average)</Text>
                <Text style={styles.windowTime}>{panchangData.gulika_kaal}</Text>
              </View>
            </View>
          </View>

          {/* Choghadiya & Hora Hourly Grid Sections */}
          <View style={[styles.card, { marginBottom: 60 }]}>
            {/* Tab Selectors (Hora vs Choghadiya) */}
            <View style={styles.gridTabs}>
              <TouchableOpacity
                onPress={() => setActiveGridTab("choghadiya")}
                style={[
                  styles.gridTab,
                  activeGridTab === "choghadiya" && styles.gridTabActive,
                ]}
              >
                <Text style={[styles.gridTabText, activeGridTab === "choghadiya" && styles.gridTabTextActive]}>
                  Choghadiya
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveGridTab("hora")}
                style={[
                  styles.gridTab,
                  activeGridTab === "hora" && styles.gridTabActive,
                ]}
              >
                <Text style={[styles.gridTabText, activeGridTab === "hora" && styles.gridTabTextActive]}>
                  Hora Grid
                </Text>
              </TouchableOpacity>
            </View>

            {/* Day / Night Filter */}
            <View style={styles.dayNightContainer}>
              <TouchableOpacity
                onPress={() => setDayNightTab("day")}
                style={[
                  styles.dayNightBtn,
                  dayNightTab === "day" && styles.dayNightBtnActive,
                ]}
              >
                <MaterialIcons name="wb-sunny" size={16} color={dayNightTab === "day" ? "#ffffff" : "#64748b"} />
                <Text style={[styles.dayNightText, dayNightTab === "day" && styles.dayNightTextActive]}>Daytime</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDayNightTab("night")}
                style={[
                  styles.dayNightBtn,
                  dayNightTab === "night" && styles.dayNightBtnActive,
                ]}
              >
                <MaterialIcons name="nights-stay" size={16} color={dayNightTab === "night" ? "#ffffff" : "#64748b"} />
                <Text style={[styles.dayNightText, dayNightTab === "night" && styles.dayNightTextActive]}>Nighttime</Text>
              </TouchableOpacity>
            </View>

            {/* Hours Grid */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeadCell, { flex: 2 }]}>Time Interval</Text>
                <Text style={[styles.tableHeadCell, { flex: 2 }]}>Planet / Slot</Text>
                <Text style={[styles.tableHeadCell, { textAlign: "right", flex: 1 }]}>Quality</Text>
              </View>

              {panchangData[activeGridTab][dayNightTab].map((slot: TimeSlot, idx: number) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2, color: "#475569" }]}>{slot.time}</Text>
                  <Text style={[styles.tableCell, { flex: 2, fontWeight: "bold" }]}>{slot.name}</Text>
                  <View style={styles.qualityContainer}>
                    <Text style={[styles.qualityBadge, { color: getAuspiciousQualityColor(slot.quality), borderColor: getAuspiciousQualityColor(slot.quality) }]}>
                      {slot.quality}
                    </Text>
                  </View>
                </View>
              ))}
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
  dateSelectorContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
    paddingVertical: 12,
  },
  dateStripe: {
    paddingHorizontal: 16,
    gap: 8,
  },
  datePill: {
    width: 60,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  datePillActive: {
    backgroundColor: "#7c3aed",
  },
  dateDayText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "700",
    marginBottom: 2,
  },
  dateDayTextActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  dateNumberText: {
    fontSize: 18,
    color: "#1e293b",
    fontWeight: "bold",
  },
  dateNumberTextActive: {
    color: "#ffffff",
  },
  dateMonthText: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 2,
  },
  dateMonthTextActive: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  scrollContent: {
    padding: 20,
  },
  solarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  solarCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    width: "48%",
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  solarInfo: {
    marginLeft: 12,
  },
  solarLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  solarValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 2,
  },
  festCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  festGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  festIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  festContent: {
    flex: 1,
  },
  festSub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "bold",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  festTitle: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 2,
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
  panchangGrid: {
    marginTop: 4,
  },
  panchangGridRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
    paddingBottom: 12,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  gridSub: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  windowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  windowIndicator: {
    width: 6,
    height: 36,
    borderRadius: 3,
    marginRight: 12,
  },
  windowContent: {
    flex: 1,
  },
  windowLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  windowTime: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "500",
    marginTop: 2,
  },
  gridTabs: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  gridTab: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  gridTabActive: {
    backgroundColor: "#ffffff",
  },
  gridTabText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  gridTabTextActive: {
    color: "#7c3aed",
  },
  dayNightContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  dayNightBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  dayNightBtnActive: {
    backgroundColor: "#7c3aed",
  },
  dayNightText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  dayNightTextActive: {
    color: "#ffffff",
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.15)",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeadCell: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.06)",
    alignItems: "center",
  },
  tableCell: {
    fontSize: 13,
    color: "#1e293b",
  },
  qualityContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  qualityBadge: {
    fontSize: 11,
    fontWeight: "bold",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
