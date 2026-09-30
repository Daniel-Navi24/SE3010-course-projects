import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = { onPress: () => void };

export function SaveButton({ onPress }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Text style={[styles.text, { color: theme.onPrimary }]}>SAVE</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 16, borderRadius: 6, alignItems: "center" },
  text: { fontSize: 16, fontWeight: "700", letterSpacing: 1 },
});
