import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

interface CalendarDay {
  dayNum: number;
  dateStr: string;
  tithi: string;
  isPurnima?: boolean;
  isAmavasya?: boolean;
  hasVrat?: boolean;
  vratName?: string;
  festivals: string[];
}

export const HinduCalendarDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [activeDate, setActiveDate] = useState("2026-05-15");
  const [selectedMonth, setSelectedMonth] = useState("May 2026");

  // Dynamic calendar mock data for May 2026 (starting on Friday, 31 days)
  const generateMonthDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    for (let i = 1; i <= 31; i++) {
      const dayNum = i;
      const dateStr = `2026-05-${String(i).padStart(2, "0")}`;
      
      let tithi = `Shukla Paksha Dwitiya`;
      let isPurnima = false;
      let isAmavasya = false;
      let hasVrat = false;
      let vratName = "";
      const festivals: string[] = [];

      // May 2026 Mock moon cycles & Vrats
      if (i === 1) {
        isPurnima = true;
        tithi = "Purnima (Full Moon)";
        hasVrat = true;
        vratName = "Buddha Purnima";
        festivals.push("Buddha Jayanti");
      } else if (i === 15) {
        isAmavasya = true;
        tithi = "Amavasya (New Moon)";
        hasVrat = true;
        vratName = "Vat Savitri Vrat";
        festivals.push("Shani Jayanti");
      } else if (i === 11 || i === 26) {
        tithi = i === 11 ? "Shukla Paksha Ekadashi" : "Krishna Paksha Ekadashi";
        hasVrat = true;
        vratName = i === 11 ? "Mohini Ekadashi" : "Apara Ekadashi";
        festivals.push(i === 11 ? "Mohini Ekadashi Fast" : "Apara Ekadashi Vrat");
      } else if (i === 28) {
        tithi = "Pradosh Vrat (Krishna)";
        hasVrat = true;
        vratName = "Pradosh Vrat";
        festivals.push("Shiva Pradosh Puja");
      } else {
        tithi = i > 15 ? `Krishna Paksha Tithi ${i - 15}` : `Shukla Paksha Tithi ${i}`;
      }

      days.push({
        dayNum,
        dateStr,
        tithi,
        isPurnima,
        isAmavasya,
        hasVrat,
        vratName,
        festivals,
      });
    }
    return days;
  };

  const days = generateMonthDays();
  const activeDayData = days.find((d) => d.dateStr === activeDate) || days[14];

  // Hindu Year (Vikram Samvat) parameters
  const VikramSamvat = "2083";
  const ShakaSamvat = "1948";
  const Ayana = "Uttarayana (Northern Transit)";
  const Ritu = "Grishma (Summer)";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hindu Calendar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Selector Banner */}
        <View style={styles.monthBanner}>
          <Text style={styles.monthTitle}>{selectedMonth}</Text>
          <View style={styles.samvatRow}>
            <Text style={styles.samvatLabel}>Vikram Samvat {VikramSamvat}</Text>
            <View style={styles.dot} />
            <Text style={styles.samvatLabel}>Shaka Samvat {ShakaSamvat}</Text>
          </View>
        </View>

        {/* Days of Week Header */}
        <View style={styles.weekHeader}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
            <Text key={idx} style={styles.weekDayText}>{d}</Text>
          ))}
        </View>

        {/* Calendar Grid (May 2026 starts on Friday - 5 blank days) */}
        <View style={styles.gridContainer}>
          {Array(5).fill(null).map((_, idx) => (
            <View key={`empty-${idx}`} style={styles.emptyGridCell} />
          ))}
          {days.map((day) => {
            const isSelected = day.dateStr === activeDate;
            return (
              <TouchableOpacity
                key={day.dateStr}
                onPress={() => setActiveDate(day.dateStr)}
                style={[
                  styles.gridCell,
                  isSelected && styles.gridCellActive,
                ]}
              >
                <Text style={[styles.gridCellText, isSelected && styles.gridCellTextActive]}>
                  {day.dayNum}
                </Text>
                
                {/* Visual Indicators */}
                <View style={styles.indicatorRow}>
                  {day.isPurnima && <View style={[styles.indicatorDot, { backgroundColor: "#f59e0b" }]} />}
                  {day.isAmavasya && <View style={[styles.indicatorDot, { backgroundColor: "#475569" }]} />}
                  {day.hasVrat && !day.isPurnima && !day.isAmavasya && <View style={[styles.indicatorDot, { backgroundColor: "#db2777" }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Day Panchang Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardSectionTitle}>Lunar & Vedic Parameters</Text>
          <View style={styles.paramRow}>
            <MaterialIcons name="brightness-3" size={18} color="#7c3aed" />
            <View style={styles.paramTextContainer}>
              <Text style={styles.paramLabel}>TITHI & PAKSHA</Text>
              <Text style={styles.paramValue}>{activeDayData.tithi}</Text>
            </View>
          </View>

          <View style={[styles.paramRow, { marginTop: 12 }]}>
            <MaterialIcons name="wb-sunny" size={18} color="#db2777" />
            <View style={styles.paramTextContainer}>
              <Text style={styles.paramLabel}>AYANA & TRANSIT</Text>
              <Text style={styles.paramValue}>{Ayana}</Text>
            </View>
          </View>

          <View style={[styles.paramRow, { marginTop: 12 }]}>
            <MaterialIcons name="spa" size={18} color="#10b981" />
            <View style={styles.paramTextContainer}>
              <Text style={styles.paramLabel}>RITU (SEASON)</Text>
              <Text style={styles.paramValue}>{Ritu}</Text>
            </View>
          </View>
        </View>

        {/* Vrats / Festivals on this day */}
        <Text style={styles.sectionHeading}>Upcoming Fasts & Vrats</Text>
        <View style={styles.vratsList}>
          {days.filter(d => d.hasVrat).map((vratDay, idx) => (
            <View key={idx} style={styles.vratCard}>
              <View style={styles.vratHeader}>
                <View style={styles.vratLeft}>
                  <MaterialIcons name="stars" size={18} color="#db2777" />
                  <Text style={styles.vratTitle}>{vratDay.vratName}</Text>
                </View>
                <Text style={styles.vratDate}>May {vratDay.dayNum}</Text>
              </View>
              <Text style={styles.vratDesc}>
                Highly auspicious Vedic fasting day. Ideal for meditation, charitable donations, and spiritual rituals.
              </Text>
            </View>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  monthBanner: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  samvatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  samvatLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 8,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    color: "#94a3b8",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 12,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  emptyGridCell: {
    width: `${100 / 7}%`,
    height: 48,
  },
  gridCell: {
    width: `${100 / 7}%`,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 2,
  },
  gridCellActive: {
    backgroundColor: "#7c3aed",
  },
  gridCellText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#475569",
  },
  gridCellTextActive: {
    color: "#ffffff",
  },
  indicatorRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
    position: "absolute",
    bottom: 4,
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  paramRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paramTextContainer: {
    flex: 1,
  },
  paramLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  paramValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  vratsList: {
    gap: 12,
  },
  vratCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  vratHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vratLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vratTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  vratDate: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#64748b",
  },
  vratDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },
});
