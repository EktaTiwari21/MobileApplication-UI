import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { KundaliReportScreen } from "./src/screens/kundali/KundaliReportScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#570005",
            },
            headerTintColor: "#C5A059",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: "#1E1E1E",
            },
          }}
        >
          <Stack.Screen
            name="KundaliReport"
            component={KundaliReportScreen}
            options={{
              title: "Professional Vedic Horoscope",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
});
