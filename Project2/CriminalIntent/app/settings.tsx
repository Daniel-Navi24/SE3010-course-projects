import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { themes } from "../theme/themes";
import { useTheme } from "../context/ThemeContext";
import { ScreenHeader } from "../components/ScreenHeader";

export default function SettingsScreen() {
  const { theme, themeKey, setThemeKey } = useTheme();
  const themeList = Object.values(themes);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Settings" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.heading, { color: theme.text }]}>
          Pick a Theme
        </Text>

        {themeList.map((t) => {
          const selected = t.key === themeKey;
          return (
            <Pressable
              key={t.key}
              onPress={() => setThemeKey(t.key)}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: t.primary,
                  borderColor: selected ? theme.text : "transparent",
                  borderWidth: selected ? 2 : 0,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: t.onPrimary }]}>
                {t.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: { fontSize: 18, fontWeight: "600" },
});
