import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { useKundaliStore } from "../../store/useKundaliStore";
import { NorthIndianChart } from "../../components/NorthIndianChart";

export const KundaliReportScreen = () => {
  const { activeKundali, isLoading, error, currentProfile, setProfileAndFetch } = useKundaliStore();

  useEffect(() => {
    if (!activeKundali && !isLoading && !error) {
      setProfileAndFetch({
        native_name: "Aarav Sharma",
        dob: "15/08/1995",
        tob: "14:30",
        location: "New Delhi, India",
      });
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#C5A059" />
        <Text style={styles.loadingTitle}>Calculating Planetary Matrices...</Text>
        <Text style={styles.loadingSubtitle}>Querying Swiss Ephemeris & Core Engines</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Calculation Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              setProfileAndFetch(
                currentProfile || { native_name: "Aarav Sharma", dob: "15/08/1995", tob: "14:30", location: "New Delhi, India" }
              )
            }
          >
            <Text style={styles.retryButtonText}>RETRY CALCULATION</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!activeKundali) return null;

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ padding: 16 }}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Text style={styles.nativeName}>{activeKundali.native_name}</Text>
        <Text style={styles.profileMeta}>
          {activeKundali.dob} • {activeKundali.tob} • {activeKundali.location}
        </Text>
      </View>

      {/* Chart */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>RASI KUNDALI (NORTH INDIAN)</Text>
        <NorthIndianChart houses={activeKundali.houses} ascendantSign={activeKundali.ascendant_sign} />
      </View>

      {/* Planetary Positions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>PLANETARY POSITIONS</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: "25%" }]}>Planet</Text>
          <Text style={[styles.tableHeaderText, { width: "25%" }]}>Sign</Text>
          <Text style={[styles.tableHeaderText, { width: "25%", textAlign: "center" }]}>House</Text>
          <Text style={[styles.tableHeaderText, { width: "25%", textAlign: "right" }]}>Deg</Text>
        </View>
        {activeKundali.planets.map((p, idx) => (
          <View key={`planet-${idx}`} style={styles.tableRow}>
            <Text style={[styles.planetName, { width: "25%" }]}>
              {p.name} {p.is_retrograde ? "[R]" : ""}
            </Text>
            <Text style={[styles.planetSign, { width: "25%" }]}>{p.sign}</Text>
            <Text style={[styles.planetHouse, { width: "25%", textAlign: "center" }]}>{p.house}</Text>
            <Text style={[styles.planetDeg, { width: "25%", textAlign: "right" }]}>
              {p.sign_degrees.toFixed(1)}°
            </Text>
          </View>
        ))}
      </View>

      {/* Yogas */}
      {activeKundali.yogas?.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>FORMED YOGAS</Text>
          {activeKundali.yogas.map((yoga, i) => (
            <View key={`yoga-${i}`} style={styles.yogaCard}>
              <Text style={styles.yogaName}>{yoga.name}</Text>
              <Text style={styles.yogaDesc}>{yoga.description}</Text>
              <Text style={styles.yogaEffect}>{yoga.effects}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Doshas */}
      {activeKundali.doshas?.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>DOSHA ANALYSIS</Text>
          {activeKundali.doshas.map((dosha, i) => (
            <View
              key={`dosha-${i}`}
              style={[styles.doshaCard, dosha.is_present ? styles.doshaPresent : styles.doshaAbsent]}
            >
              <View style={styles.doshaHeader}>
                <Text style={styles.doshaName}>{dosha.name}</Text>
                <Text style={[styles.doshaStatus, { color: dosha.is_present ? "#7B1113" : "rgba(255,255,255,0.4)" }]}>
                  {dosha.is_present ? "Detected" : "Not Present"}
                </Text>
              </View>
              <Text style={styles.doshaDesc}>{dosha.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Current Dasha */}
      {activeKundali.dasha_current && (
        <View style={styles.dashaCard}>
          <Text style={styles.dashaLabel}>RUNNING MAHADASHA</Text>
          <Text style={styles.dashaValue}>{activeKundali.dasha_current}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#1E1E1E" },
  centerContainer: { flex: 1, backgroundColor: "#1E1E1E", justifyContent: "center", alignItems: "center", padding: 24 },
  loadingTitle: { color: "#C5A059", marginTop: 16, letterSpacing: 2, textTransform: "uppercase", textAlign: "center", fontSize: 13 },
  loadingSubtitle: { color: "rgba(255,255,255,0.6)", marginTop: 4, fontSize: 11, textAlign: "center" },
  errorCard: { backgroundColor: "rgba(87,0,5,0.4)", borderWidth: 1, borderColor: "#7B1113", borderRadius: 24, padding: 16, width: "100%", alignItems: "center" },
  errorTitle: { color: "#fff", fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  errorMessage: { color: "rgba(255,255,255,0.8)", fontSize: 11, textAlign: "center", marginBottom: 16 },
  retryButton: { backgroundColor: "#7B1113", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "rgba(197,160,89,0.4)" },
  retryButtonText: { color: "#C5A059", fontWeight: "bold", fontSize: 11, letterSpacing: 1.5 },
  profileHeader: { marginBottom: 24, alignItems: "center" },
  nativeName: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  profileMeta: { fontSize: 11, color: "#C5A059", marginTop: 4 },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: 2, marginBottom: 8 },
  card: { marginBottom: 24, backgroundColor: "rgba(30,30,30,0.75)", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  cardTitle: { fontSize: 12, color: "#C5A059", letterSpacing: 2, marginBottom: 12 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)", paddingBottom: 8, marginBottom: 8 },
  tableHeaderText: { fontSize: 11, color: "rgba(255,255,255,0.6)" },
  tableRow: { flexDirection: "row", paddingVertical: 6, alignItems: "center" },
  planetName: { fontSize: 12, color: "#fff", fontWeight: "bold" },
  planetSign: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  planetHouse: { fontSize: 12, color: "#C5A059" },
  planetDeg: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  yogaCard: { backgroundColor: "rgba(30,30,30,0.75)", borderRadius: 24, padding: 12, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: "#C5A059" },
  yogaName: { fontSize: 12, color: "#fff", fontWeight: "bold" },
  yogaDesc: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  yogaEffect: { fontSize: 11, color: "#C5A059", marginTop: 4, fontStyle: "italic" },
  doshaCard: { borderRadius: 24, padding: 12, marginBottom: 8, borderWidth: 1 },
  doshaPresent: { backgroundColor: "rgba(87,0,5,0.2)", borderColor: "#7B1113" },
  doshaAbsent: { backgroundColor: "rgba(30,30,30,0.75)", borderColor: "rgba(255,255,255,0.1)" },
  doshaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  doshaName: { fontSize: 12, color: "#fff", fontWeight: "bold" },
  doshaStatus: { fontSize: 12, fontWeight: "bold" },
  doshaDesc: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4 },
  dashaCard: { backgroundColor: "rgba(87,0,5,0.3)", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "rgba(197,160,89,0.4)", alignItems: "center", marginBottom: 32 },
  dashaLabel: { fontSize: 11, color: "#C5A059", letterSpacing: 1.5 },
  dashaValue: { fontSize: 16, color: "#fff", fontWeight: "bold", marginTop: 2 },
});
