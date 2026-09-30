import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { themes } from "../theme/themes";
import { useTheme } from "../context/ThemeContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { ThemeButton } from "../components/ThemeButton";

export default function SettingsScreen() {
  const { theme, themeKey, setThemeKey } = useTheme();
  const themeList = Object.values(themes);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: theme.text }]}>
          Pick a Theme
        </Text>
        {themeList.map((t) => (
          <ThemeButton
            key={t.key}
            theme={t}
            selected={t.key === themeKey}
            onPress={() => setThemeKey(t.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 48, gap: 16 },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
});
