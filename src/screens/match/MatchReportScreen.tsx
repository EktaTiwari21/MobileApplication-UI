import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { useMatchStore } from "../../store/useMatchStore";

const { width } = Dimensions.get("window");

export const MatchReportScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { matchResult, error, currentProfiles } = useMatchStore();

  if (error) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <MaterialIcons name="error-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>Error calculating match</Text>
        <Text style={styles.errorDesc}>{error}</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!matchResult) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <MaterialIcons name="sentiment-dissatisfied" size={64} color="#94a3b8" />
        <Text style={styles.errorText}>No Match Data</Text>
        <Text style={styles.errorDesc}>
          Please enter profile details first.
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { total_score, max_score, is_compatible, detailed_scores, conclusion } =
    matchResult;

  // SVG Gauge calculations
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total_score / max_score;
  const strokeDashoffset = circumference - progress * circumference;

  // Determine Compatibility Color
  const getScoreColor = () => {
    if (total_score >= 25) return "#10b981"; // Success Green
    if (total_score >= 18) return "#7c3aed"; // Cosmic Purple
    return "#f59e0b"; // Warning Orange
  };

  const getScoreLabel = () => {
    if (total_score >= 25) return "Excellent Compatibility";
    if (total_score >= 18) return "Good Compatibility";
    return "Average Compatibility";
  };

  const gunasMetadata = [
    { key: "varna", name: "Varna", max: 1, desc: "Mental compatibility & work capacity" },
    { key: "vashya", name: "Vashya", max: 2, desc: "Mutual attraction & dominance control" },
    { key: "tara", name: "Tara", max: 3, desc: "Health, longevity & destiny alignment" },
    { key: "yoni", name: "Yoni", max: 4, desc: "Physical intimacy & biological compatibility" },
    { key: "grahamaitri", name: "Graha Maitri", max: 5, desc: "Intellectual harmony & friendship" },
    { key: "gana", name: "Gana", max: 6, desc: "Temperament & social behavior compatibility" },
    { key: "bhakoot", name: "Bhakoot", max: 7, desc: "Emotional wellness & family prosperity" },
    { key: "nadi", name: "Nadi", max: 8, desc: "Genetic health, progeny & spiritual bond" },
  ];

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
        >
          <MaterialIcons name="arrow-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cosmic Compatibility</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Partner Names Header Banner */}
        <View style={styles.namesBanner}>
          <LinearGradient
            colors={["#7c3aed", "#db2777"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.namesGradient}
          >
            <View style={styles.nameSection}>
              <MaterialIcons name="male" size={24} color="#ffffff" />
              <Text style={styles.partnerName} numberOfLines={1}>
                {matchResult.boy_name}
              </Text>
            </View>
            <View style={styles.pulseContainer}>
              <MaterialIcons name="favorite" size={28} color="#ffffff" />
            </View>
            <View style={styles.nameSection}>
              <MaterialIcons name="female" size={24} color="#ffffff" />
              <Text style={styles.partnerName} numberOfLines={1}>
                {matchResult.girl_name}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Circular compatibility gauge */}
        <View style={styles.gaugeCard}>
          <View style={styles.gaugeRow}>
            <View style={styles.gaugeContainer}>
              <Svg width={size} height={size}>
                {/* Background Ring */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(148,163,184,0.15)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Progress Ring */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={getScoreColor()}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </Svg>
              <View style={styles.gaugeContent}>
                <Text style={[styles.gaugeScoreText, { color: getScoreColor() }]}>
                  {total_score}
                </Text>
                <Text style={styles.gaugeMaxText}>/{max_score}</Text>
              </View>
            </View>

            <View style={styles.gaugeMeta}>
              <View style={styles.badgeContainer}>
                <Text
                  style={[
                    styles.badgeText,
                    {
                      backgroundColor: is_compatible
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(245,158,11,0.1)",
                      color: is_compatible ? "#10b981" : "#f59e0b",
                    },
                  ]}
                >
                  {is_compatible ? "FAVORABLE MATCH" : "REMEDIES RECOMMENDED"}
                </Text>
              </View>
              <Text style={styles.gaugeLabel}>{getScoreLabel()}</Text>
              <Text style={styles.gaugeSubText}>
                Based on traditional Ashtakoota compatibility principles.
              </Text>
            </View>
          </View>
        </View>

        {/* Detailed interpretation card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="receipt-long" size={22} color="#7c3aed" />
            <Text style={styles.cardTitle}>Vedic Analysis Conclusion</Text>
          </View>
          <Text style={styles.conclusionText}>{conclusion}</Text>
        </View>

        {/* Narrative interpretations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="stars" size={22} color="#db2777" />
            <Text style={styles.cardTitle}>Cosmic Breakdown</Text>
          </View>

          <View style={styles.narrativeItem}>
            <View style={styles.narrativeBullet}>
              <MaterialIcons name="favorite" size={16} color="#db2777" />
            </View>
            <View style={styles.narrativeContent}>
              <Text style={styles.narrativeTitle}>Relationship Strengths</Text>
              <Text style={styles.narrativeDesc}>
                {total_score >= 18
                  ? "The alignment suggests highly favorable intellectual and emotional cohesion. Excellent communication channels prevent long-term friction, supporting shared life ambitions and spiritual growth."
                  : "A moderate emotional baseline is present. Respecting each other's career goals and introducing transparency into family matters will construct a stronger foundation."}
              </Text>
            </View>
          </View>

          <View style={styles.narrativeItem}>
            <View style={styles.narrativeBullet}>
              <MaterialIcons name="security" size={16} color="#7c3aed" />
            </View>
            <View style={styles.narrativeContent}>
              <Text style={styles.narrativeTitle}>Mutual Support & Security</Text>
              <Text style={styles.narrativeDesc}>
                With favorable Graha Maitri and Vashya dynamics, this connection thrives on deep mutual trust and safety. The couple exhibits strong abilities to overcome financial and domestic challenges collaboratively.
              </Text>
            </View>
          </View>
        </View>

        {/* Guna Breakdown Table */}
        <View style={[styles.card, { marginBottom: 60 }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="format-list-numbered" size={22} color="#7c3aed" />
            <Text style={styles.cardTitle}>Ashtakoota Guna Details</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadCell, { flex: 2 }]}>Guna Category</Text>
            <Text style={[styles.tableHeadCell, { textAlign: "center", flex: 1 }]}>
              Obtained
            </Text>
            <Text style={[styles.tableHeadCell, { textAlign: "center", flex: 1 }]}>
              Max Score
            </Text>
          </View>

          {gunasMetadata.map((guna) => {
            const score = (detailed_scores as any)[guna.key] || 0;
            const isFull = score === guna.max;
            return (
              <View key={guna.key} style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.gunaName}>{guna.name}</Text>
                  <Text style={styles.gunaDesc}>{guna.desc}</Text>
                </View>
                <View style={styles.tableCellCenter}>
                  <Text
                    style={[
                      styles.scoreObtained,
                      { color: score > 0 ? "#1e293b" : "#94a3b8" },
                    ]}
                  >
                    {score}
                  </Text>
                </View>
                <View style={styles.tableCellCenter}>
                  <Text style={styles.scoreMax}>{guna.max}</Text>
                </View>
              </View>
            );
          })}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 16,
  },
  errorDesc: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  backBtnText: {
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
  scrollContent: {
    padding: 20,
  },
  namesBanner: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  namesGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  pulseContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },
  gaugeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  gaugeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  gaugeContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gaugeContent: {
    position: "absolute",
    alignItems: "center",
  },
  gaugeScoreText: {
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 38,
  },
  gaugeMaxText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "bold",
  },
  gaugeMeta: {
    flex: 1,
    paddingLeft: 20,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  gaugeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  gaugeSubText: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 15,
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
  conclusionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  narrativeItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  narrativeBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(219,39,119,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  narrativeContent: {
    flex: 1,
  },
  narrativeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  narrativeDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.15)",
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeadCell: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94a3b8",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.08)",
    alignItems: "center",
  },
  gunaName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  gunaDesc: {
    fontSize: 11,
    color: "#94a3b8",
  },
  tableCellCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreObtained: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreMax: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
  },
});
