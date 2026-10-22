import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { LibraryProvider } from "../context/LibraryContext";

function ThemedStack() {
  const { theme, ready } = useTheme();
  if (!ready) return null;

  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="detail" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="journal" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LibraryProvider>
          <ThemedStack />
        </LibraryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
