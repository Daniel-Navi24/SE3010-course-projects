import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export function ScreenHeader({ title, showBack = true }: { title: string, showBack?: boolean }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack && router.canGoBack() && (
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
              <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
            </Pressable>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.right} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: "#111", borderBottomWidth: 1, borderBottomColor: "#333" },
  row: { height: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: 8 },
  left: { width: 60, flexDirection: "row", alignItems: "center" },
  right: { width: 60 },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700", color: "#fff" },
  iconBtn: { padding: 8 },
});
