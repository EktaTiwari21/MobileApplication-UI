import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Line, Polygon, Text as SvgText } from "react-native-svg";
import { useKundaliStore } from "../src/store/useKundaliStore";

// ─── North Indian Chart Component ───
const NorthIndianChart = ({
  houses,
  ascendantSign,
}: {
  houses: { house_number: number; sign: string; planets: string[] }[];
  ascendantSign: string;
}) => {
  const size = 300;
  const half = size / 2;
  const positions = [
    { h: 1, x: half, y: half - 60 },       { h: 2, x: half - 60, y: half - 120 },
    { h: 3, x: half - 120, y: half - 60 },  { h: 4, x: half - 60, y: half },
    { h: 5, x: half - 120, y: half + 60 },  { h: 6, x: half - 60, y: half + 120 },
    { h: 7, x: half, y: half + 60 },         { h: 8, x: half + 60, y: half + 120 },
    { h: 9, x: half + 120, y: half + 60 },  { h: 10, x: half + 60, y: half },
    { h: 11, x: half + 120, y: half - 60 }, { h: 12, x: half + 60, y: half - 120 },
  ];
  const code: Record<string, string> = {
    Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
    Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
  };

  return (
    <View style={s.chartWrap}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon points={`2,2 ${size-2},2 ${size-2},${size-2} 2,${size-2}`} fill="none" stroke="#C5A059" strokeWidth="2" />
        <Line x1="0" y1="0" x2={size} y2={size} stroke="#C5A059" strokeWidth="1.5" strokeOpacity={0.5} />
        <Line x1={size} y1="0" x2="0" y2={size} stroke="#C5A059" strokeWidth="1.5" strokeOpacity={0.5} />
        <Line x1={half} y1="0" x2="0" y2={half} stroke="#C5A059" strokeWidth="1.5" strokeOpacity={0.5} />
        <Line x1="0" y1={half} x2={half} y2={size} stroke="#C5A059" strokeWidth="1.5" strokeOpacity={0.5} />
        <Line x1={half} y1={size} x2={size} y2={half} stroke="#C5A059" strokeWidth="1.5" strokeOpacity={0.5} />
        <Line x1={size} y1={half} x2={half} y2="0" stroke="#C5A059" strokeWidth="1.5" strokeOpacity={0.5} />
        {positions.map((p) => {
          const hd = houses.find((h) => h.house_number === p.h);
          const label = (hd?.planets || []).map((n) => code[n] || n.slice(0, 2)).join(" ");
          return (
            <React.Fragment key={p.h}>
              <SvgText x={p.x} y={p.y - 12} fontSize="10" fill="#C5A059" textAnchor="middle" opacity={0.6}>{p.h}</SvgText>
              <SvgText x={p.x} y={p.y + 4} fontSize="13" fontWeight="bold" fill="#FFF" textAnchor="middle">{label}</SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <Text style={s.lagnaLabel}>Lagna (Ascendant): {ascendantSign}</Text>
    </View>
  );
};

// ─── Main Screen ───
export default function Index() {
  const { activeKundali, isLoading, error, currentProfile, setProfileAndFetch } = useKundaliStore();

  useEffect(() => {
    if (!activeKundali && !isLoading && !error) {
      setProfileAndFetch({ native_name: "Aarav Sharma", dob: "15/08/1995", tob: "14:30", location: "New Delhi, India" });
    }
  }, []);

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#C5A059" />
        <Text style={s.loadTitle}>Calculating Planetary Matrices...</Text>
        <Text style={s.loadSub}>Querying Swiss Ephemeris & Core Engines</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.center}>
        <View style={s.errCard}>
          <Text style={s.errTitle}>Calculation Error</Text>
          <Text style={s.errMsg}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => setProfileAndFetch(currentProfile || { native_name: "Aarav Sharma", dob: "15/08/1995", tob: "14:30", location: "New Delhi, India" })}>
            <Text style={s.retryTxt}>RETRY</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!activeKundali) return null;
  const k = activeKundali;

  return (
    <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}>
      {/* Profile */}
      <View style={s.profileHead}>
        <Text style={s.name}>{k.native_name}</Text>
        <Text style={s.meta}>{k.dob} • {k.tob} • {k.location}</Text>
      </View>

      {/* Chart */}
      <View style={s.section}>
        <Text style={s.secTitle}>RASI KUNDALI (NORTH INDIAN)</Text>
        <NorthIndianChart houses={k.houses} ascendantSign={k.ascendant_sign} />
      </View>

      {/* Planets Table */}
      <View style={s.card}>
        <Text style={s.cardTitle}>PLANETARY POSITIONS</Text>
        <View style={s.tblHead}>
          <Text style={[s.tblHdTxt, { width: "25%" }]}>Planet</Text>
          <Text style={[s.tblHdTxt, { width: "25%" }]}>Sign</Text>
          <Text style={[s.tblHdTxt, { width: "25%", textAlign: "center" }]}>House</Text>
          <Text style={[s.tblHdTxt, { width: "25%", textAlign: "right" }]}>Deg</Text>
        </View>
        {k.planets.map((p, i) => (
          <View key={i} style={s.tblRow}>
            <Text style={[s.pName, { width: "25%" }]}>{p.name}{p.is_retrograde ? " [R]" : ""}</Text>
            <Text style={[s.pSign, { width: "25%" }]}>{p.sign}</Text>
            <Text style={[s.pHouse, { width: "25%", textAlign: "center" }]}>{p.house}</Text>
            <Text style={[s.pDeg, { width: "25%", textAlign: "right" }]}>{p.sign_degrees.toFixed(1)}°</Text>
          </View>
        ))}
      </View>

      {/* Yogas */}
      {k.yogas?.length > 0 && (
        <View style={s.section}>
          <Text style={s.secTitle}>FORMED YOGAS</Text>
          {k.yogas.map((y, i) => (
            <View key={i} style={s.yogaCard}>
              <Text style={s.yogaName}>{y.name}</Text>
              <Text style={s.yogaDesc}>{y.description}</Text>
              <Text style={s.yogaFx}>{y.effects}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Doshas */}
      {k.doshas?.length > 0 && (
        <View style={s.section}>
          <Text style={s.secTitle}>DOSHA ANALYSIS</Text>
          {k.doshas.map((d, i) => (
            <View key={i} style={[s.doshaCard, d.is_present ? s.doshaOn : s.doshaOff]}>
              <View style={s.doshaRow}>
                <Text style={s.doshaName}>{d.name}</Text>
                <Text style={[s.doshaStat, { color: d.is_present ? "#7B1113" : "rgba(255,255,255,0.4)" }]}>{d.is_present ? "Detected" : "Not Present"}</Text>
              </View>
              <Text style={s.doshaDesc}>{d.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Dasha */}
      {k.dasha_current && (
        <View style={s.dashaCard}>
          <Text style={s.dashaLbl}>RUNNING MAHADASHA</Text>
          <Text style={s.dashaVal}>{k.dasha_current}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#1E1E1E" },
  center: { flex: 1, backgroundColor: "#1E1E1E", justifyContent: "center", alignItems: "center", padding: 24 },
  loadTitle: { color: "#C5A059", marginTop: 16, letterSpacing: 2, textTransform: "uppercase", textAlign: "center", fontSize: 13 },
  loadSub: { color: "rgba(255,255,255,0.6)", marginTop: 4, fontSize: 11, textAlign: "center" },
  errCard: { backgroundColor: "rgba(87,0,5,0.4)", borderWidth: 1, borderColor: "#7B1113", borderRadius: 24, padding: 16, width: "100%", alignItems: "center" },
  errTitle: { color: "#fff", fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  errMsg: { color: "rgba(255,255,255,0.8)", fontSize: 11, textAlign: "center", marginBottom: 16 },
  retryBtn: { backgroundColor: "#7B1113", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "rgba(197,160,89,0.4)" },
  retryTxt: { color: "#C5A059", fontWeight: "bold", fontSize: 11, letterSpacing: 1.5 },
  profileHead: { marginBottom: 24, alignItems: "center" },
  name: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  meta: { fontSize: 11, color: "#C5A059", marginTop: 4 },
  section: { marginBottom: 24 },
  secTitle: { fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: 2, marginBottom: 8 },
  card: { marginBottom: 24, backgroundColor: "rgba(30,30,30,0.75)", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  cardTitle: { fontSize: 12, color: "#C5A059", letterSpacing: 2, marginBottom: 12 },
  tblHead: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)", paddingBottom: 8, marginBottom: 8 },
  tblHdTxt: { fontSize: 11, color: "rgba(255,255,255,0.6)" },
  tblRow: { flexDirection: "row", paddingVertical: 6, alignItems: "center" },
  pName: { fontSize: 12, color: "#fff", fontWeight: "bold" },
  pSign: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  pHouse: { fontSize: 12, color: "#C5A059" },
  pDeg: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  yogaCard: { backgroundColor: "rgba(30,30,30,0.75)", borderRadius: 24, padding: 12, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: "#C5A059" },
  yogaName: { fontSize: 12, color: "#fff", fontWeight: "bold" },
  yogaDesc: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  yogaFx: { fontSize: 11, color: "#C5A059", marginTop: 4, fontStyle: "italic" },
  doshaCard: { borderRadius: 24, padding: 12, marginBottom: 8, borderWidth: 1 },
  doshaOn: { backgroundColor: "rgba(87,0,5,0.2)", borderColor: "#7B1113" },
  doshaOff: { backgroundColor: "rgba(30,30,30,0.75)", borderColor: "rgba(255,255,255,0.1)" },
  doshaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  doshaName: { fontSize: 12, color: "#fff", fontWeight: "bold" },
  doshaStat: { fontSize: 12, fontWeight: "bold" },
  doshaDesc: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4 },
  dashaCard: { backgroundColor: "rgba(87,0,5,0.3)", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "rgba(197,160,89,0.4)", alignItems: "center", marginBottom: 32 },
  dashaLbl: { fontSize: 11, color: "#C5A059", letterSpacing: 1.5 },
  dashaVal: { fontSize: 16, color: "#fff", fontWeight: "bold", marginTop: 2 },
  chartWrap: { alignItems: "center", justifyContent: "center", backgroundColor: "rgba(30,30,30,0.75)", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "rgba(197,160,89,0.2)", overflow: "hidden" },
  lagnaLabel: { fontSize: 11, color: "#C5A059", marginTop: 12, letterSpacing: 2, textTransform: "uppercase" },
});
