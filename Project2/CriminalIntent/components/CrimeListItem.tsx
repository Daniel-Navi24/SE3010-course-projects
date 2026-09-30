import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Crime } from "../types/Crime";

type Props = { crime: Crime; onPress: () => void };

export function CrimeListItem({ crime, onPress }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {crime.title || "(untitled)"}
        </Text>
        <Text style={[styles.date, { color: theme.subtext }]}>{crime.date}</Text>
      </View>

      {crime.solved && (
        <MaterialCommunityIcons
          name="handcuffs"
          size={26}
          color={theme.text}
          style={{ marginLeft: 12 }}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  date: { fontSize: 14 },
});
