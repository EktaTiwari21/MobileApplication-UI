import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useKundaliStore } from "../../store/useKundaliStore";
import { NorthIndianChart } from "../../components/NorthIndianChart";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export const KundaliReportScreen = () => {
  const navigation = useNavigation<any>();
  const { activeKundali, isLoading, error, currentProfile, setProfileAndFetch } = useKundaliStore();


  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: "#f8fafc" }]}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={[styles.loadingTitle, { color: "#7c3aed" }]}>CALCULATING VEDIC BLUEPRINT...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: "#f8fafc" }]}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Calculation Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              setProfileAndFetch(
                currentProfile || { native_name: "Aravind Sharma", dob: "14 Oct 1990", tob: "14:30", location: "New Delhi, India" }
              )
            }
          >
            <Text style={styles.retryButtonText}>RETRY CALCULATION</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!activeKundali) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: "#f8fafc" }]}>
        <Text style={{ fontSize: 16, color: "#64748b", marginBottom: 16 }}>No Kundali Data Found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      
      {/* Header Profile Info */}
      <View style={styles.headerSection}>
        <View style={styles.badgeContainer}>
          <MaterialIcons name="workspace-premium" size={14} color="#db2777" />
          <Text style={styles.badgeText}>VEDIC BLUEPRINT</Text>
        </View>
        <Text style={styles.nativeName}>{activeKundali.native_name}</Text>
        <View style={styles.metaContainer}>
          <MaterialIcons name="calendar-today" size={16} color="#64748b" />
          <Text style={styles.metaText}>{activeKundali.dob}</Text>
          <MaterialIcons name="location-on" size={16} color="#64748b" style={{ marginLeft: 12 }} />
          <Text style={styles.metaText}>{activeKundali.location.split(',')[0]}</Text>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <LinearGradient colors={["#f3e8ff", "#e0e7ff"]} style={styles.chartContainer}>
          <View style={styles.chartInner}>
             <NorthIndianChart houses={activeKundali.houses} ascendantSign={activeKundali.ascendant_sign} />
          </View>
        </LinearGradient>
      </View>



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { padding: 24, paddingBottom: 100 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingTitle: { marginTop: 16, letterSpacing: 2, fontSize: 13, fontWeight: "600" },
  errorCard: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#ef4444", borderRadius: 24, padding: 16, width: "100%", alignItems: "center" },
  errorTitle: { color: "#b91c1c", fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  errorMessage: { color: "#991b1b", fontSize: 13, textAlign: "center", marginBottom: 16 },
  retryButton: { backgroundColor: "#ef4444", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  retryButtonText: { color: "#ffffff", fontWeight: "bold", fontSize: 11, letterSpacing: 1.5 },
  
  headerSection: { alignItems: "center", marginTop: 16, marginBottom: 40 },
  badgeContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(219,39,119,0.1)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: "rgba(219,39,119,0.2)", marginBottom: 12 },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#db2777", marginLeft: 6, letterSpacing: 1 },
  nativeName: { fontSize: 34, fontWeight: "700", color: "#1e293b", marginBottom: 8 },
  metaContainer: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 16, color: "#64748b", marginLeft: 4, fontWeight: "500" },

  chartSection: { alignItems: "center", marginBottom: 40 },
  chartContainer: { width: width * 0.85, height: width * 0.85, maxWidth: 340, maxHeight: 340, borderRadius: 16, padding: 4, elevation: 12, shadowColor: "#7c3aed", shadowOpacity: 0.2, shadowRadius: 24, justifyContent: "center", alignItems: "center" },
  chartInner: { width: "100%", height: "100%", backgroundColor: "#ffffff", borderRadius: 12, overflow: "hidden" },

  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b", marginBottom: 16 },
  
  numeroCard: { width: "31%", borderRadius: 16, padding: 12, alignItems: "center", elevation: 6, shadowColor: "#4c1d95", shadowOpacity: 0.2, shadowRadius: 8 },
  numeroLabel: { fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: "600", textTransform: "uppercase" },
  numeroValue: { fontSize: 36, fontWeight: "bold", color: "#ffffff", marginVertical: 4 },
  numeroDesc: { fontSize: 11, color: "rgba(255,255,255,0.9)", textAlign: "center" },

  planetScroll: { paddingRight: 24, gap: 12 },
  planetCard: { borderWidth: 1, borderColor: "rgba(148,163,184,0.2)", borderRadius: 12, padding: 12, width: 140, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, position: "relative", overflow: "hidden", marginRight: 12 },
  planetAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  planetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  planetName: { fontSize: 14, fontWeight: "bold", color: "#1e293b" },
  planetFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 },
  planetSign: { fontSize: 13, color: "#64748b" },
  planetDeg: { fontSize: 16, fontWeight: "bold" },

  dashaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 },
  dashaCurrentText: { fontSize: 14, fontWeight: "bold", color: "#db2777", letterSpacing: 0.5 },
  timelineScroll: { paddingVertical: 12, position: "relative" },
  timelineLine: { position: "absolute", top: "35%", left: 0, right: 0, height: 2, backgroundColor: "#cbd5e1" },
  timelineNode: { alignItems: "center", width: 90 },
  nodeDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, marginBottom: 8, zIndex: 10, backgroundColor: "#f8fafc" },
  nodePast: { backgroundColor: "#e2e8f0", borderColor: "#94a3b8" },
  nodeLabelPast: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  nodeDatePast: { fontSize: 10, color: "#94a3b8", marginTop: 2 },
  nodeCurrent: { backgroundColor: "#db2777", borderColor: "#f8fafc", width: 16, height: 16, borderRadius: 8 },
  nodePulse: { position: "absolute", top: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(219,39,119,0.2)", zIndex: 1 },
  nodeLabelCurrent: { fontSize: 14, fontWeight: "bold", color: "#db2777" },
  nodeDateCurrent: { fontSize: 11, color: "#db2777", marginTop: 2 },
  nodeFuture: { borderColor: "#f59e0b" },
  nodeFuture2: { borderColor: "#94a3b8" },
  nodeLabelFuture: { fontSize: 12, fontWeight: "600", color: "#1e293b" },
  nodeDateFuture: { fontSize: 10, color: "#64748b", marginTop: 2 },

  doshaGrid: { gap: 16 },
  doshaCard: { borderRadius: 16, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "rgba(148,163,184,0.2)", shadowColor: "#94a3b8", shadowOpacity: 0.1, shadowRadius: 16, overflow: "hidden" },
  doshaContent: { flex: 1, paddingRight: 16 },
  doshaCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  doshaName: { fontSize: 18, fontWeight: "bold", color: "#db2777" },
  doshaBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, marginLeft: 8 },
  doshaBadgeHigh: { backgroundColor: "rgba(219,39,119,0.1)" },
  doshaBadgeLow: { backgroundColor: "#f1f5f9" },
  doshaBadgeText: { fontSize: 10, fontWeight: "bold", letterSpacing: 1 },
  doshaDesc: { fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 18 },
  gaugeContainer: { width: 64, height: 64, position: "relative" },
  gaugeCenter: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
  gaugeText: { fontSize: 14, fontWeight: "bold" },

  gemContainer: { gap: 12 },
  gemCard: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, elevation: 6 },
  gemIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center", marginRight: 16 },
  gemContent: { flex: 1 },
  gemTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff", marginBottom: 4 },
  gemDesc: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
});
