import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

export function ScreenContainer({ children, style }: { children: React.ReactNode, style?: ViewStyle }) {
  const { theme } = useTheme();
  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }, style]}>
      {children}
    </View>
  );
}
