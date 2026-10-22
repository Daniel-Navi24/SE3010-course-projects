import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { themes } from "../theme/themes";
import { useTheme } from "../context/ThemeContext";
import { useLibrary } from "../context/LibraryContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { ThemeButton } from "../components/ThemeButton";
import { DefaultFilter } from "../types/Prefs";

const FILTER_OPTIONS: { key: DefaultFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "owned", label: "Owned" },
  { key: "wishlist", label: "Wishlist" },
  { key: "playing", label: "Playing" },
  { key: "completed", label: "Completed" },
];

export default function SettingsScreen() {
  const { theme, themeKey, setThemeKey } = useTheme();
  const { prefs, updatePrefs, setFilter } = useLibrary();
  const themeList = Object.values(themes);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: theme.text }]}>Theme</Text>
        {themeList.map((t) => (
          <ThemeButton
            key={t.key}
            theme={t}
            selected={t.key === themeKey}
            onPress={() => setThemeKey(t.key)}
          />
        ))}

        <Text style={[styles.heading, { color: theme.text, marginTop: 24 }]}>
          Preferences
        </Text>

        <View
          style={[
            styles.row,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              Haptic feedback
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>
              Short vibrations on ratings and saves
            </Text>
          </View>
          <Switch
            value={prefs.hapticsEnabled}
            onValueChange={(v) => updatePrefs({ hapticsEnabled: v })}
          />
        </View>

        <Text style={[styles.subheading, { color: theme.text }]}>
          Default filter
        </Text>
        <View style={styles.chipRow}>
          {FILTER_OPTIONS.map((opt) => {
            const selected = prefs.defaultFilter === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  updatePrefs({ defaultFilter: opt.key });
                  setFilter(opt.key);
                }}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.primary : theme.card,
                    borderColor: selected ? theme.primary : theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selected ? theme.onPrimary : theme.text,
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 48, gap: 12 },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  rowLabel: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
});
