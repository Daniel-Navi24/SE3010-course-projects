import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { DefaultFilter } from "../types/Prefs";

const OPTIONS: { key: DefaultFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "owned", label: "Owned" },
  { key: "wishlist", label: "Wishlist" },
  { key: "playing", label: "Playing" },
  { key: "completed", label: "Completed" },
];

type Props = { value: DefaultFilter; onChange: (f: DefaultFilter) => void };

export function FilterChips({ value, onChange }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      {OPTIONS.map((opt) => {
        const selected = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
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
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
});
