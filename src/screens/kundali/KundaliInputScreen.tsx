import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useKundaliStore } from "../../store/useKundaliStore";

export const KundaliInputScreen = () => {
  const navigation = useNavigation<any>();
  const { setProfileAndFetch, isLoading } = useKundaliStore();

  const [name, setName] = useState("Aravind Sharma");
  const [day, setDay] = useState("14");
  const [month, setMonth] = useState("10");
  const [year, setYear] = useState("1990");
  const [hour, setHour] = useState("14");
  const [minute, setMinute] = useState("30");
  const [locationStr, setLocationStr] = useState("New Delhi, India");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLon, setSelectedLon] = useState<number | null>(null);

  useEffect(() => {
    if (locationStr.length < 3 || (selectedLat !== null && selectedLon !== null)) {
      setLocationResults([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationStr)}&format=json&addressdetails=1&limit=5`,
          {
            headers: {
              "User-Agent": "AstroPreciseApp/1.0",
              "Accept-Language": "en-US,en;q=0.9"
            }
          }
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setLocationResults(data);
      } catch (err) {
        console.error("Location search error", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [locationStr]);

  const handleSelectLocation = (loc: any) => {
    setLocationStr(loc.display_name);
    setSelectedLat(parseFloat(loc.lat));
    setSelectedLon(parseFloat(loc.lon));
    setLocationResults([]);
  };

  const handleLocationChange = (text: string) => {
    setLocationStr(text);
    setSelectedLat(null);
    setSelectedLon(null);
  };

  const handleGenerate = async () => {
    const payload = {
      native_name: name,
      dob: `${day}/${month}/${year}`,
      tob: `${hour}:${minute}`,
      location: locationStr,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
      lat: selectedLat || undefined,
      lon: selectedLon || undefined
    };

    await setProfileAndFetch(payload);
    navigation.navigate("KundaliReport");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialIcons name="auto-graph" size={48} color="#7c3aed" />
          <Text style={styles.title}>Vedic Kundali</Text>
          <Text style={styles.subtitle}>Enter birth details to generate an ultra-precise astrological chart based on the Swiss Ephemeris.</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter name" placeholderTextColor="#94a3b8" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Date of Birth (DD/MM/YYYY)</Text>
              <View style={styles.row}>
                <TextInput style={[styles.input, styles.dateInput]} value={day} onChangeText={setDay} placeholder="DD" keyboardType="number-pad" maxLength={2} />
                <Text style={styles.slash}>/</Text>
                <TextInput style={[styles.input, styles.dateInput]} value={month} onChangeText={setMonth} placeholder="MM" keyboardType="number-pad" maxLength={2} />
                <Text style={styles.slash}>/</Text>
                <TextInput style={[styles.input, styles.dateInput, { flex: 2 }]} value={year} onChangeText={setYear} placeholder="YYYY" keyboardType="number-pad" maxLength={4} />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Time of Birth (HH:MM 24hr)</Text>
              <View style={styles.row}>
                <TextInput style={[styles.input, styles.dateInput]} value={hour} onChangeText={setHour} placeholder="HH" keyboardType="number-pad" maxLength={2} />
                <Text style={styles.slash}>:</Text>
                <TextInput style={[styles.input, styles.dateInput]} value={minute} onChangeText={setMinute} placeholder="MM" keyboardType="number-pad" maxLength={2} />
              </View>
            </View>
          </View>

          <View style={[styles.inputGroup, { zIndex: 10 }]}>
            <Text style={styles.label}>City of Birth</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="location-city" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={locationStr} 
                onChangeText={handleLocationChange} 
                placeholder="Search city, town, or village" 
                placeholderTextColor="#94a3b8" 
              />
              {isSearchingLocation && (
                <ActivityIndicator color="#7c3aed" style={{ paddingRight: 16 }} size="small" />
              )}
            </View>
            
            {locationResults.length > 0 && (
              <View style={styles.autocompleteDropdown}>
                {locationResults.map((loc, idx) => (
                  <TouchableOpacity 
                    key={loc.place_id || idx} 
                    style={styles.autocompleteItem}
                    onPress={() => handleSelectLocation(loc)}
                  >
                    <MaterialIcons name="place" size={16} color="#7c3aed" style={{ marginRight: 8, marginTop: 2 }} />
                    <Text style={styles.autocompleteText} numberOfLines={2}>{loc.display_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity onPress={handleGenerate} disabled={isLoading} style={{ marginTop: 16 }}>
            <LinearGradient colors={["#6d28d9", "#4c1d95"]} style={styles.generateBtn}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.generateBtnText}>Generate Kundali</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 24, paddingBottom: 60 },
  header: { alignItems: "center", marginBottom: 32, marginTop: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b", marginTop: 12 },
  subtitle: { fontSize: 14, color: "#64748b", textAlign: "center", marginTop: 8, lineHeight: 20, paddingHorizontal: 12 },
  formCard: { backgroundColor: "#ffffff", borderRadius: 24, padding: 24, shadowColor: "#4c1d95", shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569", marginBottom: 8 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 12, borderWidth: 1, borderColor: "rgba(148,163,184,0.1)" },
  inputIcon: { paddingLeft: 16 },
  input: { flex: 1, height: 50, paddingHorizontal: 16, fontSize: 15, color: "#1e293b" },
  row: { flexDirection: "row", alignItems: "center" },
  dateInput: { backgroundColor: "#f1f5f9", borderRadius: 12, borderWidth: 1, borderColor: "rgba(148,163,184,0.1)", textAlign: "center", flex: 1 },
  slash: { fontSize: 20, color: "#94a3b8", marginHorizontal: 8 },
  generateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 56, borderRadius: 16 },
  generateBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginRight: 8 },
  autocompleteDropdown: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: 200,
    overflow: "hidden",
  },
  autocompleteItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
  },
  autocompleteText: {
    fontSize: 13,
    color: "#334155",
    flex: 1,
    lineHeight: 18,
  }
});
