import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMatchStore } from "../../store/useMatchStore";

const { width } = Dimensions.get("window");

export const MatchScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { fetchMatchCompatibility, isLoading } = useMatchStore();

  // Boy (Partner 1) States
  const [boyName, setBoyName] = useState("Rahul Kumar");
  const [boyDay, setBoyDay] = useState("18");
  const [boyMonth, setBoyMonth] = useState("06");
  const [boyYear, setBoyYear] = useState("1992");
  const [boyHour, setBoyHour] = useState("09");
  const [boyMinute, setBoyMinute] = useState("15");
  const [boyLocation, setBoyLocation] = useState("New Delhi, India");
  const [boyLat, setBoyLat] = useState<number | null>(null);
  const [boyLon, setBoyLon] = useState<number | null>(null);
  const [boyLocResults, setBoyLocResults] = useState<any[]>([]);
  const [isSearchingBoyLoc, setIsSearchingBoyLoc] = useState(false);

  // Girl (Partner 2) States
  const [girlName, setGirlName] = useState("Priya Sharma");
  const [girlDay, setGirlDay] = useState("24");
  const [girlMonth, setGirlMonth] = useState("11");
  const [girlYear, setGirlYear] = useState("1994");
  const [girlHour, setGirlHour] = useState("18");
  const [girlMinute, setGirlMinute] = useState("45");
  const [girlLocation, setGirlLocation] = useState("Mumbai, India");
  const [girlLat, setGirlLat] = useState<number | null>(null);
  const [girlLon, setGirlLon] = useState<number | null>(null);
  const [girlLocResults, setGirlLocResults] = useState<any[]>([]);
  const [isSearchingGirlLoc, setIsSearchingGirlLoc] = useState(false);

  // Location Autocomplete - Boy
  useEffect(() => {
    if (boyLocation.length < 3 || (boyLat !== null && boyLon !== null)) {
      setBoyLocResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsSearchingBoyLoc(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            boyLocation
          )}&format=json&addressdetails=1&limit=3`,
          {
            headers: {
              "User-Agent": "AstroPreciseApp/1.0",
              "Accept-Language": "en-US,en;q=0.9",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setBoyLocResults(data);
        }
      } catch (err) {
        console.error("Boy location search error", err);
      } finally {
        setIsSearchingBoyLoc(false);
      }
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [boyLocation]);

  // Location Autocomplete - Girl
  useEffect(() => {
    if (girlLocation.length < 3 || (girlLat !== null && girlLon !== null)) {
      setGirlLocResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsSearchingGirlLoc(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            girlLocation
          )}&format=json&addressdetails=1&limit=3`,
          {
            headers: {
              "User-Agent": "AstroPreciseApp/1.0",
              "Accept-Language": "en-US,en;q=0.9",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setGirlLocResults(data);
        }
      } catch (err) {
        console.error("Girl location search error", err);
      } finally {
        setIsSearchingGirlLoc(false);
      }
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [girlLocation]);

  const handleSelectBoyLoc = (loc: any) => {
    setBoyLocation(loc.display_name);
    setBoyLat(parseFloat(loc.lat));
    setBoyLon(parseFloat(loc.lon));
    setBoyLocResults([]);
  };

  const handleSelectGirlLoc = (loc: any) => {
    setGirlLocation(loc.display_name);
    setGirlLat(parseFloat(loc.lat));
    setGirlLon(parseFloat(loc.lon));
    setGirlLocResults([]);
  };

  const handleCalculate = async () => {
    const boyPayload = {
      name: boyName,
      day: boyDay,
      month: boyMonth,
      year: boyYear,
      hour: boyHour,
      minute: boyMinute,
      location: boyLocation,
      lat: boyLat || undefined,
      lon: boyLon || undefined,
    };

    const girlPayload = {
      name: girlName,
      day: girlDay,
      month: girlMonth,
      year: girlYear,
      hour: girlHour,
      minute: girlMinute,
      location: girlLocation,
      lat: girlLat || undefined,
      lon: girlLon || undefined,
    };

    await fetchMatchCompatibility(boyPayload, girlPayload);
    navigation.navigate("MatchReport");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <MaterialIcons name="favorite" size={20} color="#ffffff" />
          </View>
          <Text style={styles.appName}>AstroPrecise Match</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Assess relationship harmony and Vedic compatibility (Kundali Milan)
          using time-tested Ashtakoota Guna metrics.
        </Text>

        {/* Partner 1 (Groom/Boy) Card */}
        <View style={styles.formCard}>
          <LinearGradient
            colors={["rgba(124,58,237,0.1)", "rgba(124,58,237,0.01)"]}
            style={styles.cardHeaderGradient}
          >
            <View style={styles.cardHeaderTitleRow}>
              <MaterialIcons name="male" size={24} color="#7c3aed" />
              <Text style={styles.cardTitle}>Groom's Details (Partner 1)</Text>
            </View>
          </LinearGradient>

          <View style={styles.cardBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={boyName}
                  onChangeText={(t) => {
                    setBoyName(t);
                  }}
                  placeholder="Enter name"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth (DD/MM/YYYY)</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={boyDay}
                  onChangeText={(t) => setBoyDay(t)}
                  placeholder="DD"
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.slash}>/</Text>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={boyMonth}
                  onChangeText={(t) => setBoyMonth(t)}
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.slash}>/</Text>
                <TextInput
                  style={[styles.input, styles.dateInput, { flex: 2 }]}
                  value={boyYear}
                  onChangeText={(t) => setBoyYear(t)}
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time of Birth (HH:MM 24hr)</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={boyHour}
                  onChangeText={(t) => setBoyHour(t)}
                  placeholder="HH"
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.slash}>:</Text>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={boyMinute}
                  onChangeText={(t) => setBoyMinute(t)}
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { zIndex: 30 }]}>
              <Text style={styles.label}>City of Birth</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="location-city"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={boyLocation}
                  onChangeText={(t) => {
                    setBoyLocation(t);
                    setBoyLat(null);
                    setBoyLon(null);
                  }}
                  placeholder="Search city, town, or village"
                  placeholderTextColor="#94a3b8"
                />
                {isSearchingBoyLoc && (
                  <ActivityIndicator
                    color="#7c3aed"
                    style={{ paddingRight: 16 }}
                    size="small"
                  />
                )}
              </View>

              {boyLocResults.length > 0 && (
                <View style={styles.autocompleteDropdown}>
                  {boyLocResults.map((loc, idx) => (
                    <TouchableOpacity
                      key={loc.place_id || idx}
                      style={styles.autocompleteItem}
                      onPress={() => handleSelectBoyLoc(loc)}
                    >
                      <MaterialIcons
                        name="place"
                        size={16}
                        color="#7c3aed"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text style={styles.autocompleteText} numberOfLines={2}>
                        {loc.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Partner 2 (Bride/Girl) Card */}
        <View style={[styles.formCard, { marginTop: 20 }]}>
          <LinearGradient
            colors={["rgba(219,39,119,0.1)", "rgba(219,39,119,0.01)"]}
            style={styles.cardHeaderGradient}
          >
            <View style={styles.cardHeaderTitleRow}>
              <MaterialIcons name="female" size={24} color="#db2777" />
              <Text style={styles.cardTitle}>Bride's Details (Partner 2)</Text>
            </View>
          </LinearGradient>

          <View style={styles.cardBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={girlName}
                  onChangeText={(t) => {
                    setGirlName(t);
                  }}
                  placeholder="Enter name"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth (DD/MM/YYYY)</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={girlDay}
                  onChangeText={(t) => setGirlDay(t)}
                  placeholder="DD"
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.slash}>/</Text>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={girlMonth}
                  onChangeText={(t) => setGirlMonth(t)}
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.slash}>/</Text>
                <TextInput
                  style={[styles.input, styles.dateInput, { flex: 2 }]}
                  value={girlYear}
                  onChangeText={(t) => setGirlYear(t)}
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time of Birth (HH:MM 24hr)</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={girlHour}
                  onChangeText={(t) => setGirlHour(t)}
                  placeholder="HH"
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.slash}>:</Text>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={girlMinute}
                  onChangeText={(t) => setGirlMinute(t)}
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { zIndex: 20 }]}>
              <Text style={styles.label}>City of Birth</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="location-city"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={girlLocation}
                  onChangeText={(t) => {
                    setGirlLocation(t);
                    setGirlLat(null);
                    setGirlLon(null);
                  }}
                  placeholder="Search city, town, or village"
                  placeholderTextColor="#94a3b8"
                />
                {isSearchingGirlLoc && (
                  <ActivityIndicator
                    color="#db2777"
                    style={{ paddingRight: 16 }}
                    size="small"
                  />
                )}
              </View>

              {girlLocResults.length > 0 && (
                <View style={styles.autocompleteDropdown}>
                  {girlLocResults.map((loc, idx) => (
                    <TouchableOpacity
                      key={loc.place_id || idx}
                      style={styles.autocompleteItem}
                      onPress={() => handleSelectGirlLoc(loc)}
                    >
                      <MaterialIcons
                        name="place"
                        size={16}
                        color="#db2777"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text style={styles.autocompleteText} numberOfLines={2}>
                        {loc.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Calculate Action */}
        <TouchableOpacity
          onPress={handleCalculate}
          disabled={isLoading}
          style={{ marginTop: 32, marginBottom: 100 }}
        >
          <LinearGradient
            colors={["#7c3aed", "#db2777"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.calculateBtn}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.calculateBtnText}>
                  Calculate Cosmic Compatibility
                </Text>
                <MaterialIcons name="favorite" size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
    backgroundColor: "#ffffff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  scrollContent: {
    padding: 24,
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
    overflow: "hidden",
    shadowColor: "#7c3aed",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeaderGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
  },
  cardHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginLeft: 8,
  },
  cardBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.1)",
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#1e293b",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.1)",
    textAlign: "center",
    flex: 1,
  },
  slash: {
    fontSize: 18,
    color: "#94a3b8",
    marginHorizontal: 8,
  },
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
    maxHeight: 180,
    overflow: "hidden",
  },
  autocompleteItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
  },
  autocompleteText: {
    fontSize: 12,
    color: "#334155",
    flex: 1,
    lineHeight: 16,
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
});
