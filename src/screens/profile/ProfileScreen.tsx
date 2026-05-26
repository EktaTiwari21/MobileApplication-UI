import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const [proMode, setProMode] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <View style={[styles.container]}>
      
      {/* Cosmic Header Backdrop */}
      <LinearGradient colors={["#4c1d95", "#7c3aed", "#db2777"]} style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAW5UhN9YLn79jdR7ZN0DWxFckAt_3UMJMgLlRI9e29o37FkfTMzXjhjyOCMW9ZC3NfvNgb5LVsYL1d_DnBfKUQJBpt0FAivavf3_0Hul4QUDyraPp3Ch1843zm85LrSyIadqHekNriYdsifZy0XJov-sIMvxXKCrI_aqwCvWj_SEMtex8QwKpvJ5hUH9w0F2JX_03Df0Jw9_vDfjXGnNdSXYS9bw1Up7dMEQVe1Ocg_2R0NJdsJzOrFhxArILxwdMzRTPmk1HbBg" }} 
              style={styles.avatar} 
            />
            <Text style={styles.appName}>AstroPrecise Pro</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={styles.searchButton}>
              <MaterialIcons name="search" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={logout}>
              <MaterialIcons name="logout" size={24} color="#fca5a5" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageSubtitle}>Namaste, {user?.full_name || "Pt. Aravind"}. Here is your overview.</Text>
            
            {/* Achievement Badges */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <MaterialIcons name="workspace-premium" size={14} color="#f59e0b" style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, { color: "#f59e0b" }]}>Top Rated</Text>
              </View>
              <View style={styles.badge}>
                <MaterialIcons name="group" size={14} color="#fcd34d" style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, { color: "#fcd34d" }]}>1k+ Consultations</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.proModeToggle}>
            <Text style={styles.proModeText}>PRO MODE</Text>
            <Switch
              trackColor={{ false: "rgba(255,255,255,0.3)", true: "#10b981" }}
              thumbColor={"#ffffff"}
              onValueChange={setProMode}
              value={proMode}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Quick Actions Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]}>
            <MaterialIcons name="podcasts" size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: "#ffffff" }]}>Go Live Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialIcons name="event-available" size={18} color="#4c1d95" style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: "#4c1d95" }]}>Manage Slots</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialIcons name="edit-note" size={18} color="#4c1d95" style={{ marginRight: 6 }} />
            <Text style={[styles.actionBtnText, { color: "#4c1d95" }]}>Client Notes</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Revenue Analytics (Bento Item 1) */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="auto-graph" size={20} color="#7c3aed" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Revenue Analytics</Text>
            </View>
            <Text style={styles.dropdownText}>This Month <MaterialIcons name="arrow-drop-down" size={16} /></Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Total Earnings</Text>
              <Text style={styles.statValuePrimary}>₹ 45,200</Text>
            </View>
            <View style={[styles.statCol, styles.statBorder]}>
              <Text style={styles.statLabel}>Consultations</Text>
              <Text style={styles.statValue}>124</Text>
            </View>
            <View style={[styles.statCol, styles.statBorder]}>
              <Text style={styles.statLabel}>Avg. Rating</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.statValueSecondary}>4.9</Text>
                <MaterialIcons name="star" size={16} color="#f59e0b" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>

          {/* Abstract Chart Representation */}
          <View style={styles.chartContainer}>
            <View style={[styles.chartBar, { height: "25%" }]} />
            <View style={[styles.chartBar, { height: "33%" }]} />
            <View style={[styles.chartBar, { height: "50%" }]} />
            <View style={[styles.chartBar, { height: "75%", backgroundColor: "rgba(124,58,237,0.3)", borderTopWidth: 2, borderTopColor: "#7c3aed" }]} />
            <View style={[styles.chartBar, { height: "50%" }]} />
            <View style={[styles.chartBar, { height: "100%", backgroundColor: "rgba(219,39,119,0.2)", borderTopWidth: 2, borderTopColor: "#db2777" }]} />
            <View style={[styles.chartBar, { height: "66%" }]} />
            <View style={[styles.chartBar, { height: "25%" }]} />
            <View style={styles.chartBaseline} />
          </View>
        </View>

        {/* Next Appointment (Bento Item 2) */}
        <LinearGradient colors={["#4c1d95", "#7c3aed"]} style={styles.nextApptCard}>
          <View style={styles.nextApptHeader}>
            <MaterialIcons name="schedule" size={16} color="#fcd34d" style={{ marginRight: 6 }} />
            <Text style={styles.nextApptHeaderText}>UP NEXT</Text>
          </View>
          
          <View style={styles.nextApptContent}>
            <Text style={styles.nextApptTime}>10:30 AM</Text>
            <Text style={styles.nextApptType}>Kundli Dosha Analysis</Text>
            
            <View style={styles.clientInfoBox}>
              <View style={styles.clientInitials}>
                <Text style={styles.clientInitialsText}>R</Text>
              </View>
              <View>
                <Text style={styles.clientName}>Rahul Verma</Text>
                <Text style={styles.clientStatus}>First-time client</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>Join Session</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Today's Schedule (Bento Item 3) */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="calendar-today" size={20} color="#db2777" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Today's Schedule</Text>
            </View>
            <Text style={styles.linkText}>View All</Text>
          </View>

          <View style={styles.scheduleList}>
            
            <View style={styles.scheduleItem}>
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>11:45</Text>
                <Text style={styles.ampmText}>AM</Text>
              </View>
              <View style={[styles.timeIndicator, { backgroundColor: "#7c3aed" }]} />
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Career Consultation</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <MaterialIcons name="person" size={14} color="#64748b" style={{ marginRight: 4 }} />
                  <Text style={styles.scheduleClient}>Priya Singh</Text>
                </View>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>45m</Text>
              </View>
            </View>

            <View style={styles.scheduleItem}>
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>02:00</Text>
                <Text style={styles.ampmText}>PM</Text>
              </View>
              <View style={[styles.timeIndicator, { backgroundColor: "#db2777" }]} />
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Muhurat Selection</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <MaterialIcons name="person" size={14} color="#64748b" style={{ marginRight: 4 }} />
                  <Text style={styles.scheduleClient}>Amit Sharma Family</Text>
                </View>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>30m</Text>
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
    maxWidth: 200,
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
  proModeToggle: {
    alignItems: "center",
  },
  proModeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  quickActionsScroll: {
    gap: 12,
    paddingBottom: 24,
    marginBottom: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.2)",
    marginRight: 12,
    elevation: 2,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionBtnPrimary: {
    backgroundColor: "#db2777",
    borderColor: "#db2777",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "bold",
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
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  dropdownText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  statsGrid: {
    flexDirection: "row",
    marginBottom: 24,
  },
  statCol: {
    flex: 1,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "#f1f5f9",
    paddingLeft: 16,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  statValuePrimary: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#db2777",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statValueSecondary: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  chartContainer: {
    height: 128,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    position: "relative",
  },
  chartBaseline: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  chartBar: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  nextApptCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: "#4c1d95",
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  nextApptHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  nextApptHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fcd34d",
    letterSpacing: 1,
  },
  nextApptContent: {
    marginBottom: 24,
  },
  nextApptTime: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  nextApptType: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f9a8d4",
  },
  clientInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  clientInitials: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  clientInitialsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  clientStatus: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  joinBtn: {
    backgroundColor: "#fcd34d",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  joinBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4c1d95",
  },
  scheduleList: {
    gap: 16,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.1)",
  },
  timeCol: {
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  ampmText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  timeIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginHorizontal: 16,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  scheduleClient: {
    fontSize: 14,
    color: "#64748b",
  },
  durationBadge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },
});
