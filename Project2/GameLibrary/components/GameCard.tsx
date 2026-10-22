import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Game } from "../types/Game";

type Props = { game: Game; onPress: () => void };

const STATUS_COLORS: Record<string, string> = {
  owned: "#1565C0",
  wishlist: "#F9A825",
  playing: "#2E7D32",
  completed: "#6A1B9A",
};

export function GameCard({ game, onPress }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.coverBox}>
        {game.coverUri ? (
          <Image source={{ uri: game.coverUri }} style={styles.cover} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.background }]}>
            <MaterialCommunityIcons
              name="gamepad-variant"
              size={40}
              color={theme.subtext}
            />
          </View>
        )}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[game.status] ?? "#666" },
          ]}
        >
          <Text style={styles.statusText}>{game.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text
        style={[styles.title, { color: theme.text }]}
        numberOfLines={2}
      >
        {game.title || "(untitled)"}
      </Text>
      <Text style={[styles.platform, { color: theme.subtext }]} numberOfLines={1}>
        {game.platform}
        {game.year ? ` · ${game.year}` : ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    paddingBottom: 10,
  },
  coverBox: { aspectRatio: 3 / 4, position: "relative" },
  cover: { width: "100%", height: "100%" },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  title: { fontSize: 14, fontWeight: "700", marginTop: 8, marginHorizontal: 8 },
  platform: { fontSize: 12, marginTop: 2, marginHorizontal: 8 },
});
