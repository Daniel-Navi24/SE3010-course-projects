import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { useTheme } from "../context/ThemeContext";

type Props = { value: boolean; onChange: (v: boolean) => void };

export function SolvedField({ value, onChange }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <Checkbox
        value={value}
        onValueChange={onChange}
        color={value ? theme.primary : theme.border}
      />
      <Text style={[styles.label, { color: theme.text }]}>Solved</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { fontSize: 16 },
});
