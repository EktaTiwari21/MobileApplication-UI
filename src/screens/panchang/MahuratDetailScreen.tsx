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
import { AstrologyService } from "../../services/api";

const { width } = Dimensions.get("window");

const eventTypes = [
  { id: "marriage", name: "Marriage (Vivah)", icon: "favorite" },
  { id: "business", name: "Business (Vyapar)", icon: "business" },
  { id: "vehicle", name: "Buy Vehicle", icon: "directions-car" },
  { id: "house", name: "Griha Pravesh", icon: "home" },
  { id: "investment", name: "Asset Purchase", icon: "monetization-on" },
];

export const MahuratDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [selectedEvent, setSelectedEvent] = useState("marriage");
  const [selectedDate, setSelectedDate] = useState("2026-05-30");
  const [isLoading, setIsLoading] = useState(false);
  const [muhurats, setMuhurats] = useState<any[]>([
    {
      event_type: "marriage",
      start_time: "2026-05-30 09:30 AM",
      end_time: "2026-05-30 11:45 AM",
      muhurat_name: "Shubh Vivah Muhurat",
      auspiciousness_score: 94.5,
      description: "Exceptional Nakshatra alignment with strong Ascendant lord positioning.",
    },
    {
      event_type: "marriage",
      start_time: "2026-05-30 04:15 PM",
      end_time: "2026-05-30 06:30 PM",
      muhurat_name: "Amrit Siddhi Muhurat",
      auspiciousness_score: 89.0,
      description: "Optimal Tithi alignment avoiding all malefic Rahu Kaal intervals.",
    },
  ]);

  const handleCalculate = async (eventId: string, date: string) => {
    setIsLoading(true);
    try {
      const res = await AstrologyService.findMuhurat({
        event_type: eventId,
        start_date: date,
        end_date: date,
      });
      setMuhurats(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981";
    if (score >= 75) return "#f59e0b";
    return "#ef4444";
  };

  // Generate 7 days stripe
  const getDateStripe = () => {
    const dates = [];
    const base = new Date("2026-05-30");
    for (let i = 0; i < 7; i++) {
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
      });
    }
    return dates;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shubh Muhurat</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Discover highly auspicious cosmic timings (Shubh Muhurats) custom calculated for your key life events.
        </Text>

        {/* Event Selector stripe */}
        <Text style={styles.sectionTitle}>Select Auspicious Event</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventSelector}>
          {eventTypes.map((item) => {
            const isSelected = item.id === selectedEvent;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedEvent(item.id);
                  handleCalculate(item.id, selectedDate);
                }}
                style={[styles.eventPill, isSelected && styles.eventPillActive]}
              >
                <MaterialIcons name={item.icon as any} size={20} color={isSelected ? "#ffffff" : "#7c3aed"} />
                <Text style={[styles.eventText, isSelected && styles.eventTextActive]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Date Selector Stripe */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateSelector}>
          {getDateStripe().map((item) => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <TouchableOpacity
                key={item.dateStr}
                onPress={() => {
                  setSelectedDate(item.dateStr);
                  handleCalculate(selectedEvent, item.dateStr);
                }}
                style={[styles.datePill, isSelected && styles.datePillActive]}
              >
                <Text style={[styles.dateDayText, isSelected && styles.dateDayTextActive]}>{item.dayName}</Text>
                <Text style={[styles.dateNumText, isSelected && styles.dateNumTextActive]}>{item.dayNum}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Calculating planetary alignments...</Text>
          </View>
        ) : (
          <View style={{ marginTop: 24 }}>
            {/* Suitable/Auspicious Timings Section */}
            <Text style={styles.sectionTitle}>Auspicious Muhurat Windows</Text>
            {muhurats.map((muh, idx) => (
              <View key={idx} style={styles.muhuratCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <MaterialIcons name="alarm" size={20} color="#7c3aed" />
                    <Text style={styles.muhuratName}>{muh.muhurat_name}</Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: `${getScoreColor(muh.auspiciousness_score)}15` }]}>
                    <Text style={[styles.scoreText, { color: getScoreColor(muh.auspiciousness_score) }]}>
                      {muh.auspiciousness_score}% Auspicious
                    </Text>
                  </View>
                </View>

                <View style={styles.timeInfoRow}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>START TIME</Text>
                    <Text style={styles.timeVal}>{muh.start_time.split(" ")[1] + " " + muh.start_time.split(" ")[2]}</Text>
                  </View>
                  <View style={styles.timeArrow}>
                    <MaterialIcons name="trending-flat" size={20} color="#94a3b8" />
                  </View>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>END TIME</Text>
                    <Text style={styles.timeVal}>{muh.end_time.split(" ")[1] + " " + muh.end_time.split(" ")[2]}</Text>
                  </View>
                </View>

                <Text style={styles.muhuratDesc}>{muh.description}</Text>
              </View>
            ))}

            {/* Suitability guidelines card */}
            <View style={styles.guidelinesCard}>
              <LinearGradient
                colors={["#7c3aed", "#db2777"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientCard}
              >
                <View style={styles.guidelineHeader}>
                  <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
                  <Text style={styles.guidelineTitle}>Vedic Suitability Rule</Text>
                </View>
                <Text style={styles.guidelineText}>
                  For {eventTypes.find((e) => e.id === selectedEvent)?.name || "selected event"}, always avoid Rahu Kaal. Initiating tasks during Abhijit or Amrit Siddhi guarantees steady element accumulation and positive transits.
                </Text>
              </LinearGradient>
            </View>
          </View>
        )}
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
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  eventSelector: {
    paddingBottom: 10,
    gap: 8,
  },
  eventPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.15)",
    gap: 6,
  },
  eventPillActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  eventText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },
  eventTextActive: {
    color: "#ffffff",
  },
  dateSelector: {
    paddingBottom: 10,
    gap: 8,
  },
  datePill: {
    width: 54,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.15)",
  },
  datePillActive: {
    backgroundColor: "#db2777",
    borderColor: "#db2777",
  },
  dateDayText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8",
    marginBottom: 2,
  },
  dateDayTextActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  dateNumText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  dateNumTextActive: {
    color: "#ffffff",
  },
  loadingContainer: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 13,
    color: "#7c3aed",
    fontWeight: "bold",
    marginTop: 10,
  },
  muhuratCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  muhuratName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  timeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "bold",
  },
  timeVal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 2,
  },
  timeArrow: {
    paddingHorizontal: 12,
  },
  muhuratDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },
  guidelinesCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 16,
  },
  gradientCard: {
    padding: 20,
  },
  guidelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  guidelineTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  guidelineText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 18,
  },
});
