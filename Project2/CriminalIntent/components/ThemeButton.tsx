import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Theme } from "../theme/themes";
import { useTheme } from "../context/ThemeContext";

type Props = {
  theme: Theme;
  selected: boolean;
  onPress: () => void;
};

export function ThemeButton({ theme: t, selected, onPress }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
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
      <Text style={[styles.text, { color: t.onPrimary }]}>{t.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  text: { fontSize: 18, fontWeight: "600" },
});
