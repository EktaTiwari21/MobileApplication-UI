import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

// Screens
import { HomeDashboardScreen } from "./src/screens/home/HomeDashboardScreen";
import { KundaliInputScreen } from "./src/screens/kundali/KundaliInputScreen";
import { KundaliReportScreen } from "./src/screens/kundali/KundaliReportScreen";
import { MatchScreen } from "./src/screens/match/MatchScreen";
import { MatchReportScreen } from "./src/screens/match/MatchReportScreen";
import { ProfileScreen } from "./src/screens/profile/ProfileScreen";
import { SpiritualStoreScreen } from "./src/screens/store/SpiritualStoreScreen";
import { CategoryProductsScreen } from "./src/screens/store/CategoryProductsScreen";
import { AstroChatScreen } from "./src/screens/ai/AstroChatScreen";
import { PanchangDetailScreen } from "./src/screens/panchang/PanchangDetailScreen";
import { HoroscopeDetailScreen } from "./src/screens/home/HoroscopeDetailScreen";
import { VastuAuditScreen } from "./src/screens/vastu/VastuAuditScreen";
import { MahuratDetailScreen } from "./src/screens/panchang/MahuratDetailScreen";
import { NumerologyDetailScreen } from "./src/screens/kundali/NumerologyDetailScreen";
import { HinduCalendarDetailScreen } from "./src/screens/panchang/HinduCalendarDetailScreen";
import { DailyTarotDetailScreen } from "./src/screens/home/DailyTarotDetailScreen";


import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { SignupScreen } from "./src/screens/auth/SignupScreen";
import { useAuthStore } from "./src/store/useAuthStore";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#f9f9f9" } }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// Create a Stack for the Charts tab so we can navigate to KundaliReport
function ChartsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#f8fafc" },
        headerTintColor: "#7C3AED",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#f8fafc" },
      }}
    >
      <Stack.Screen
        name="KundaliInput"
        component={KundaliInputScreen}
        options={{ title: "Vedic Astrology", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="KundaliReport"
        component={KundaliReportScreen}
        options={{ title: "AstroPrecise", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}

// Create a Stack for the Home tab to handle header
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#f8fafc" } }}>
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="SpiritualStore" component={SpiritualStoreScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="AstroChat" component={AstroChatScreen} />
      <Stack.Screen name="PanchangDetail" component={PanchangDetailScreen} />
      <Stack.Screen name="HoroscopeDetail" component={HoroscopeDetailScreen} />
      <Stack.Screen name="VastuAudit" component={VastuAuditScreen} />
      <Stack.Screen name="MahuratDetail" component={MahuratDetailScreen} />
      <Stack.Screen name="NumerologyDetail" component={NumerologyDetailScreen} />
      <Stack.Screen name="HinduCalendarDetail" component={HinduCalendarDetailScreen} />
      <Stack.Screen name="DailyTarotDetail" component={DailyTarotDetailScreen} />
    </Stack.Navigator>
  );
}

// Create a Stack for the Match tab so we can navigate to MatchReport
function MatchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#f8fafc" } }}>
      <Stack.Screen name="MatchInput" component={MatchScreen} />
      <Stack.Screen name="MatchReport" component={MatchReportScreen} />
    </Stack.Navigator>
  );
}

// Main App Tabs
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = "circle";

          if (route.name === "Daily") {
            iconName = "temple-hindu";
          } else if (route.name === "Charts") {
            iconName = "auto-graph";
          } else if (route.name === "Match") {
            iconName = "favorite";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <MaterialIcons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "rgba(255,255,255,0.95)",
          borderTopWidth: 1,
          borderTopColor: "rgba(124,58,237,0.1)",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          position: "absolute", // Gives it the floating look from the design
          bottom: 24,
          left: 24,
          right: 24,
          borderRadius: 999,
          elevation: 12,
          shadowColor: "#7C3AED",
          shadowOpacity: 0.15,
          shadowRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Daily" component={HomeStack} />
      <Tab.Screen name="Charts" component={ChartsStack} />
      <Tab.Screen name="Match" component={MatchStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <NavigationContainer>
          {isAuthenticated ? <MainApp /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
