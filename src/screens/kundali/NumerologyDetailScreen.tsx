import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";

const { width } = Dimensions.get("window");

// Map letters to Pythagorean values
const letterValues: { [key: string]: number } = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  r: 9, i: 9,
};

const vowels = ["a", "e", "i", "o", "u"];

export const NumerologyDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [name, setName] = useState("Aravind Kumar");
  const [dob, setDob] = useState("1996-08-25"); // Format YYYY-MM-DD
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const calculateNumerology = () => {
    if (!name.trim() || !dob.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      // 1. Life Path Number
      const dobClean = dob.replace(/[^0-9]/g, "");
      let lifePath = dobClean.split("").reduce((acc, digit) => acc + parseInt(digit), 0);
      while (lifePath > 9 && ![11, 22, 33].includes(lifePath)) {
        lifePath = lifePath.toString().split("").reduce((acc, digit) => acc + parseInt(digit), 0);
      }

      // 2. Destiny Number
      const nameClean = name.toLowerCase().replace(/[^a-z]/g, "");
      let destiny = nameClean.split("").reduce((acc, char) => acc + (letterValues[char] || 0), 0);
      while (destiny > 9 && ![11, 22, 33].includes(destiny)) {
        destiny = destiny.toString().split("").reduce((acc, digit) => acc + parseInt(digit), 0);
      }

      // 3. Soul Urge Number
      const nameVowels = nameClean.split("").filter((char) => vowels.includes(char));
      let soulUrge = nameVowels.reduce((acc, char) => acc + (letterValues[char] || 0), 0);
      while (soulUrge > 9 && ![11, 22, 33].includes(soulUrge)) {
        soulUrge = soulUrge.toString().split("").reduce((acc, digit) => acc + parseInt(digit), 0);
      }

      // Dynamic interpretation profiles
      const profiles: { [key: number]: any } = {
        1: { ruler: "Sun", element: "Fire", color: "Ruby Red", gem: "Ruby", desc: "A natural leader, highly independent, ambitious, and original." },
        2: { ruler: "Moon", element: "Water", color: "Pearl White", gem: "Pearl", desc: "Diplomatic, highly intuitive, cooperative, peaceful, and sensitive." },
        3: { ruler: "Jupiter", element: "Air", color: "Yellow / Gold", gem: "Yellow Sapphire", desc: "Creative, expressive, social, optimistic, and highly communicative." },
        4: { ruler: "Rahu", element: "Earth", color: "Sandalwood", gem: "Hessonite", desc: "Practical, disciplined, stable, methodical, and detail-oriented." },
        5: { ruler: "Mercury", element: "Air", color: "Emerald Green", gem: "Emerald", desc: "Freedom-loving, adventurous, versatile, highly energetic, and adaptable." },
        6: { ruler: "Venus", element: "Water", color: "Pink / Pastel", gem: "Diamond", desc: "Nurturing, responsible, artistic, loving, and family-oriented." },
        7: { ruler: "Ketu", element: "Ether", color: "Light Gray", gem: "Cat's Eye", desc: "Analytical, spiritual, reserved, highly philosophical, and truth-seeking." },
        8: { ruler: "Saturn", element: "Earth", color: "Dark Blue / Black", gem: "Blue Sapphire", desc: "Authoritative, financially successful, resilient, ambitious, and strong." },
        9: { ruler: "Mars", element: "Fire", color: "Bright Red", gem: "Red Coral", desc: "Humanitarian, compassionate, self-sacrificing, highly creative, and idealist." },
        11: { ruler: "Moon / Neptune", element: "Ether", color: "Silver", gem: "Pearl / Jade", desc: "Master Intuitive, highly spiritual, visionary, inspiring, and sensitive." },
        22: { ruler: "Rahu / Uranus", element: "Ether", color: "Copper", gem: "Garnet", desc: "Master Builder, highly practical yet spiritual, transforming dreams to reality." },
      };

      const pathNum = lifePath as number;
      const profile = profiles[pathNum] || profiles[3];

      setResults({
        lifePath,
        destiny,
        soulUrge,
        ...profile,
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cosmic Numerology</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Analyze your name and birth date vibrations to reveal your core numbers, lucky elements, and destiny blueprint.
        </Text>

        {/* Input Form Card */}
        {!results && (
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="fingerprint" size={22} color="#7c3aed" />
              <Text style={styles.cardTitle}>Vibrational Profiles</Text>
            </View>

            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full birth name"
              placeholderTextColor="#94a3b8"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>DATE OF BIRTH (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="e.g. 1996-08-25"
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity onPress={calculateNumerology} disabled={isLoading} style={{ marginTop: 24 }}>
              <LinearGradient
                colors={["#7c3aed", "#db2777"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Calculate Core Vibrations</Text>
                    <MaterialIcons name="offline-bolt" size={18} color="#ffffff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Results Screen */}
        {results && (
          <View>
            {/* Core numbers rows */}
            <View style={styles.resultsCard}>
              <Text style={styles.cardSectionTitle}>Core Numbers</Text>
              
              <View style={styles.ringsRow}>
                <View style={styles.ringBlock}>
                  <View style={styles.ringPlaceholder}>
                    <Text style={styles.ringVal}>{results.lifePath}</Text>
                  </View>
                  <Text style={styles.ringLabel}>LIFE PATH</Text>
                </View>

                <View style={styles.ringBlock}>
                  <View style={[styles.ringPlaceholder, { borderColor: "#db2777" }]}>
                    <Text style={[styles.ringVal, { color: "#db2777" }]}>{results.destiny}</Text>
                  </View>
                  <Text style={styles.ringLabel}>DESTINY</Text>
                </View>

                <View style={styles.ringBlock}>
                  <View style={[styles.ringPlaceholder, { borderColor: "#f59e0b" }]}>
                    <Text style={[styles.ringVal, { color: "#f59e0b" }]}>{results.soulUrge}</Text>
                  </View>
                  <Text style={styles.ringLabel}>SOUL URGE</Text>
                </View>
              </View>
            </View>

            {/* Lucky metrics */}
            <View style={styles.metricsCard}>
              <Text style={styles.cardSectionTitle}>Lucky Alignment Metrics</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>RULING PLANET</Text>
                  <Text style={styles.metricVal}>{results.ruler}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>COSMIC ELEMENT</Text>
                  <Text style={styles.metricVal}>{results.element}</Text>
                </View>
              </View>

              <View style={[styles.metricsGrid, { borderTopWidth: 1, borderTopColor: "rgba(148,163,184,0.1)", paddingTop: 12, marginTop: 12 }]}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>LUCKY COLOR</Text>
                  <Text style={[styles.metricVal, { color: "#db2777" }]}>{results.color}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>GEMSTONE REMEDY</Text>
                  <Text style={[styles.metricVal, { color: "#7c3aed" }]}>{results.gem}</Text>
                </View>
              </View>
            </View>

            {/* Detailed forecast text */}
            <View style={styles.forecastCard}>
              <View style={styles.forecastHeader}>
                <MaterialIcons name="auto-stories" size={22} color="#7c3aed" />
                <Text style={styles.forecastTitle}>Life Path {results.lifePath} Destiny Reading</Text>
              </View>
              <Text style={styles.forecastText}>{results.desc}</Text>
              <Text style={[styles.forecastText, { marginTop: 12, fontStyle: "italic", color: "#64748b" }]}>
                "The vibrations of Life Path {results.lifePath} suggest a deep destiny linked to {results.element}. Activating your lucky gemstone {results.gem} will significantly enhance planetary support."
              </Text>
            </View>

            <TouchableOpacity onPress={() => setResults(null)} style={styles.resetBtn}>
              <MaterialIcons name="refresh" size={18} color="#64748b" />
              <Text style={styles.resetBtnText}>Perform New Numerology Audit</Text>
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
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    gap: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
  resultsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
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
  ringsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  ringBlock: {
    alignItems: "center",
  },
  ringPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    marginBottom: 8,
  },
  ringVal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  metricsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
  },
  forecastCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  forecastHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  forecastTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
  },
  forecastText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
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
    gap: 8,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
});
