import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<any>();

  // Mock User Astrological Attributes based on birth profile
  const sunSign = "Leo";
  const moonSign = "Virgo";
  const nakshatra = "Pushya";

  return (
    <View style={styles.container}>
      
      {/* Cosmic Header Backdrop */}
      <LinearGradient colors={["#4c1d95", "#7c3aed", "#db2777"]} style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAW5UhN9YLn79jdR7ZN0DWxFckAt_3UMJMgLlRI9e29o37FkfTMzXjhjyOCMW9ZC3NfvNgb5LVsYL1d_DnBfKUQJBpt0FAivavf3_0Hul4QUDyraPp3Ch1843zm85LrSyIadqHekNriYdsifZy0XJov-sIMvxXKCrI_aqwCvWj_SEMtex8QwKpvJ5hUH9w0F2JX_03Df0Jw9_vDfjXGnNdSXYS9bw1Up7dMEQVe1Ocg_2R0NJdsJzOrFhxArILxwdMzRTPmk1HbBg" }} 
              style={styles.avatar} 
            />
            <Text style={styles.appName}>AstroPrecise</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={styles.searchButton} onPress={logout}>
              <MaterialIcons name="logout" size={22} color="#fca5a5" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.pageTitle}>My Profile</Text>
            <Text style={styles.pageSubtitle}>Namaste, {user?.full_name || "Pt. Aravind"}. View your cosmic profile.</Text>
            
            {/* Vedic Astrological Attribute Badges */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <MaterialIcons name="wb-sunny" size={14} color="#f59e0b" style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, { color: "#f59e0b" }]}>Sun: {sunSign}</Text>
              </View>
              <View style={styles.badge}>
                <MaterialIcons name="brightness-3" size={14} color="#fcd34d" style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, { color: "#fcd34d" }]}>Moon: {moonSign}</Text>
              </View>
              <View style={styles.badge}>
                <MaterialIcons name="star" size={14} color="#fcd34d" style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, { color: "#fcd34d" }]}>{nakshatra}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Saved Birth Details (Bento Card 1) */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="badge" size={20} color="#7c3aed" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Birth Profile Details</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Charts", { screen: "KundaliInput" })}>
              <Text style={styles.linkText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.birthGrid}>
            <View style={styles.birthRow}>
              <View style={styles.birthCol}>
                <Text style={styles.birthLabel}>DATE OF BIRTH</Text>
                <Text style={styles.birthValue}>25 Aug 1996</Text>
              </View>
              <View style={[styles.birthCol, styles.birthBorder]}>
                <Text style={styles.birthLabel}>TIME OF BIRTH</Text>
                <Text style={styles.birthValue}>10:30 AM</Text>
              </View>
            </View>
            <View style={[styles.birthRow, { marginTop: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 16 }]}>
              <View style={styles.birthCol}>
                <Text style={styles.birthLabel}>BIRTH PLACE</Text>
                <Text style={styles.birthValue}>New Delhi, India</Text>
              </View>
              <View style={[styles.birthCol, styles.birthBorder]}>
                <Text style={styles.birthLabel}>COORDINATES</Text>
                <Text style={styles.birthValue}>28.61° N, 77.20° E</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Active Astro Periods / Dashas (Bento Card 2) */}
        <LinearGradient colors={["#4c1d95", "#7c3aed"]} style={styles.dashaCard}>
          <View style={styles.dashaHeader}>
            <MaterialIcons name="auto-awesome" size={16} color="#fcd34d" style={{ marginRight: 6 }} />
            <Text style={styles.dashaHeaderText}>ACTIVE DASHAS</Text>
          </View>
          
          <View style={styles.dashaContent}>
            <Text style={styles.dashaTime}>Jupiter (Guru) Maha Dasha</Text>
            <Text style={styles.dashaType}>Sub-Dasha: Rahu Bhukti</Text>
            
            <View style={styles.remedyBox}>
              <MaterialIcons name="stars" size={18} color="#fcd34d" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.remedyTitle}>Vedic Remedy Recommendation</Text>
                <Text style={styles.remedyText}>Chant the Guru Beej Mantra on Thursdays & wear Yellow Sapphire to bolster planetary alignment.</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate("SpiritualStore")}>
            <Text style={styles.shopBtnText}>Get Remedy Items</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Recent Saved Consultations (Bento Card 3) */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="forum" size={20} color="#db2777" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>My Consultations</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("AstroChat")}>
              <Text style={styles.linkText}>New Chat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.consultList}>
            
            <View style={styles.consultItem}>
              <View style={styles.expertAvatar}>
                <Text style={styles.avatarText}>PA</Text>
              </View>
              <View style={styles.consultDetails}>
                <Text style={styles.consultTitle}>Kundli Dosha Analysis</Text>
                <Text style={styles.consultExpert}>with Pt. Aravind</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>

            <View style={styles.consultItem}>
              <View style={[styles.expertAvatar, { backgroundColor: "#db277715" }]}>
                <Text style={[styles.avatarText, { color: "#db2777" }]}>AS</Text>
              </View>
              <View style={styles.consultDetails}>
                <Text style={styles.consultTitle}>Career Guidance Session</Text>
                <Text style={styles.consultExpert}>with Dr. Amit Sharma</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>

          </View>
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
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  header: {
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
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#ffffff",
    marginRight: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  searchButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    marginLeft: 8,
  },
  dashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    maxWidth: 240,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  bentoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#94a3b8",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  birthGrid: {
    marginTop: 4,
  },
  birthRow: {
    flexDirection: "row",
  },
  birthCol: {
    flex: 1,
  },
  birthBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "#f1f5f9",
    paddingLeft: 16,
  },
  birthLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  birthValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
  },
  dashaCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: "#4c1d95",
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  dashaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dashaHeaderText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fcd34d",
    letterSpacing: 1,
  },
  dashaContent: {
    marginBottom: 20,
  },
  dashaTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  dashaType: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#f9a8d4",
  },
  remedyBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  remedyTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fcd34d",
    marginBottom: 4,
  },
  remedyText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 16,
  },
  shopBtn: {
    backgroundColor: "#fcd34d",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  shopBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4c1d95",
  },
  consultList: {
    gap: 14,
  },
  consultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.1)",
  },
  expertAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7c3aed15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  consultDetails: {
    flex: 1,
  },
  consultTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  consultExpert: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#64748b",
  },
});
