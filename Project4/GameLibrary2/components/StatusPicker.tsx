import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GameStatus } from "../types/Game";

const OPTIONS: { key: GameStatus; label: string }[] = [
  { key: "owned", label: "Owned" },
  { key: "wishlist", label: "Wishlist" },
  { key: "playing", label: "Playing" },
  { key: "completed", label: "Completed" },
];

type Props = { value: GameStatus; onChange: (s: GameStatus) => void };

export function StatusPicker({ value, onChange }: Props) {
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
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
});
