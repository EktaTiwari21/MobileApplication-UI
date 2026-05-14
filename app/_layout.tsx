import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
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
    />
  );
}
