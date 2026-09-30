import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.subtext}
        multiline={multiline}
        style={[
          multiline ? styles.multi : styles.single,
          {
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  single: { fontSize: 16, paddingVertical: 8, borderBottomWidth: 1 },
  multi: {
    minHeight: 120,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
});
