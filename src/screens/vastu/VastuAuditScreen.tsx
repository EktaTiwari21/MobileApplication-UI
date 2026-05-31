import React from "react";
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
import Svg, { Circle } from "react-native-svg";
import { useVastuStore, RoomEvaluation } from "../../store/useVastuStore";

const { width } = Dimensions.get("window");

const directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];

export const VastuAuditScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const {
    selections,
    auditResult,
    isLoading,
    updateRoomDirection,
    calculateVastuScore,
    resetAudit,
  } = useVastuStore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981"; // Excellent (Green)
    if (score >= 50) return "#f59e0b"; // Moderate (Amber)
    return "#ef4444"; // Deficient (Red)
  };

  const getStatusColor = (status: RoomEvaluation["status"]) => {
    if (status === "Excellent") return "#10b981";
    if (status === "Moderate") return "#f59e0b";
    return "#ef4444";
  };

  // SVG circular progress calculation
  const size = 130;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const score = auditResult?.totalScore || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const renderDirectionGrid = (roomKey: "entrance" | "kitchen" | "bedroom" | "bathroom") => {
    const selected = selections[roomKey];
    return (
      <View style={styles.directionGrid}>
        {directions.map((dir) => {
          const isSelected = selected === dir;
          return (
            <TouchableOpacity
              key={dir}
              onPress={() => updateRoomDirection(roomKey, dir)}
              style={[
                styles.dirButton,
                isSelected && styles.dirButtonActive,
              ]}
            >
              <Text style={[styles.dirText, isSelected && styles.dirTextActive]}>
                {dir}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
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
        <Text style={styles.headerTitle}>Vastu Shastra Audit</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Evaluate your house quadrants to discover energy imbalances, calculate harmony scores, and get localized cosmic corrections.
        </Text>

        {/* Audit Form Section (Renders only if no result calculated) */}
        {!auditResult ? (
          <View>
            {/* Entrance Card */}
            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="door-sliding" size={22} color="#7c3aed" />
                <Text style={styles.cardTitle}>Main Entrance Direction</Text>
              </View>
              <Text style={styles.cardDesc}>
                Stand inside your house facing the main door. Which direction are you facing?
              </Text>
              {renderDirectionGrid("entrance")}
            </View>

            {/* Kitchen Card */}
            <View style={[styles.formCard, { marginTop: 20 }]}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="local-fire-department" size={22} color="#db2777" />
                <Text style={styles.cardTitle}>Kitchen Placement</Text>
              </View>
              <Text style={styles.cardDesc}>
                Which cardinal sector of your house floor plan contains the cooking zone?
              </Text>
              {renderDirectionGrid("kitchen")}
            </View>

            {/* Master Bedroom Card */}
            <View style={[styles.formCard, { marginTop: 20 }]}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="bed" size={22} color="#7c3aed" />
                <Text style={styles.cardTitle}>Master Bedroom Position</Text>
              </View>
              <Text style={styles.cardDesc}>
                Which cardinal sector is the master bedroom allocated to?
              </Text>
              {renderDirectionGrid("bedroom")}
            </View>

            {/* Bathroom Card */}
            <View style={[styles.formCard, { marginTop: 20 }]}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="wc" size={22} color="#db2777" />
                <Text style={styles.cardTitle}>Bathrooms Zone</Text>
              </View>
              <Text style={styles.cardDesc}>
                Which cardinal direction contains the household toilets or drainage pipes?
              </Text>
              {renderDirectionGrid("bathroom")}
            </View>

            {/* Action trigger */}
            <TouchableOpacity
              onPress={calculateVastuScore}
              disabled={isLoading}
              style={{ marginTop: 32, marginBottom: 80 }}
            >
              <LinearGradient
                colors={["#7c3aed", "#db2777"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.calculateBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={styles.calculateBtnText}>Perform Element Audit</Text>
                    <MaterialIcons name="explore" size={20} color="#ffffff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          /* Results Dashboard Display */
          <View style={{ marginBottom: 60 }}>
            {/* Score ring module */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreRow}>
                <View style={styles.gaugeContainer}>
                  <Svg width={size} height={size}>
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke="rgba(148,163,184,0.15)"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke={getScoreColor(score)}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                  </Svg>
                  <View style={styles.gaugeContent}>
                    <Text style={[styles.gaugeScoreText, { color: getScoreColor(score) }]}>
                      {score}
                    </Text>
                    <Text style={styles.gaugeMaxText}>/100</Text>
                  </View>
                </View>

                <View style={styles.scoreMeta}>
                  <View style={styles.badgeContainer}>
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          backgroundColor:
                            score >= 80
                              ? "rgba(16,185,129,0.1)"
                              : score >= 50
                              ? "rgba(245,158,11,0.1)"
                              : "rgba(239,68,68,0.1)",
                          color: getScoreColor(score),
                        },
                      ]}
                    >
                      {score >= 80
                        ? "HARMONIOUS VAAS"
                        : score >= 50
                        ? "ELEMENT DEFICIENCY"
                        : "CRITICAL REBALANCING"}
                    </Text>
                  </View>
                  <Text style={styles.summaryText}>{auditResult.summary}</Text>
                </View>
              </View>
            </View>

            {/* Room Breakdown evaluations */}
            <Text style={styles.sectionHeading}>Quadrant Status</Text>
            {auditResult.evaluations.map((room, idx) => (
              <View key={idx} style={styles.roomEvalCard}>
                <View style={styles.roomHeader}>
                  <View style={styles.roomHeaderLeft}>
                    <MaterialIcons
                      name={
                        room.status === "Excellent"
                          ? "check-circle"
                          : room.status === "Moderate"
                          ? "warning"
                          : "cancel"
                      }
                      size={20}
                      color={getStatusColor(room.status)}
                    />
                    <Text style={styles.roomName}>{room.roomName}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: `${getStatusColor(room.status)}15` },
                    ]}
                  >
                    <Text style={[styles.statusPillText, { color: getStatusColor(room.status) }]}>
                      {room.status} ({room.selectedDirection})
                    </Text>
                  </View>
                </View>

                {/* If deficiency exists, render localized remedy recommendations */}
                {room.remedy && (
                  <View style={styles.remedyContainer}>
                    <View style={styles.remedyDivider} />
                    <Text style={styles.remedyTitle}>Vedic Correction Advice</Text>
                    <Text style={styles.remedyDesc}>{room.remedy}</Text>
                    
                    {room.remedyProduct && (
                      <TouchableOpacity
                        style={styles.remedyShopBtn}
                        onPress={() => navigation.navigate("SpiritualStore")}
                      >
                        <MaterialIcons name="shopping-bag" size={16} color="#7c3aed" />
                        <Text style={styles.remedyShopBtnText}>
                          Get {room.remedyProduct}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}

            {/* Recalculate options */}
            <TouchableOpacity onPress={resetAudit} style={styles.resetBtn}>
              <MaterialIcons name="refresh" size={18} color="#64748b" />
              <Text style={styles.resetBtnText}>Perform New Vastu Audit</Text>
            </TouchableOpacity>
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
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardDesc: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 16,
    marginBottom: 16,
  },
  directionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dirButton: {
    width: "23%",
    minWidth: 70,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  dirButtonActive: {
    backgroundColor: "#7c3aed",
  },
  dirText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  dirTextActive: {
    color: "#ffffff",
  },
  calculateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    gap: 8,
  },
  calculateBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  // Results view style details
  scoreCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  gaugeContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gaugeContent: {
    position: "absolute",
    alignItems: "center",
  },
  gaugeScoreText: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 36,
  },
  gaugeMaxText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "bold",
  },
  scoreMeta: {
    flex: 1,
    paddingLeft: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  roomEvalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roomName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  remedyContainer: {
    marginTop: 12,
  },
  remedyDivider: {
    height: 1,
    backgroundColor: "rgba(148,163,184,0.1)",
    marginBottom: 10,
  },
  remedyTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 4,
  },
  remedyDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  remedyShopBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(124,58,237,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  remedyShopBtnText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    marginTop: 12,
    gap: 8,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
});
