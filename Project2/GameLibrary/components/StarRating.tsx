import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";
import { useLibrary } from "../context/LibraryContext";

type Props = {
  value: number;
  onChange: (v: number) => void;
  size?: number;
};

export function StarRating({ value, onChange, size = 32 }: Props) {
  const { theme } = useTheme();
  const { prefs } = useLibrary();

  const handleTap = (i: number) => {
    if (prefs.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    // tapping the same star clears it
    onChange(value === i ? 0 : i);
  };

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => handleTap(i)} hitSlop={6}>
          <MaterialCommunityIcons
            name={value >= i ? "star" : "star-outline"}
            size={size}
            color={value >= i ? "#FFC107" : theme.subtext}
            style={{ marginRight: 4 }}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});
