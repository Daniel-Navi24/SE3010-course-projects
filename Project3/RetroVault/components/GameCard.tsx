import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Game } from "../types/Game";
export function GameCard({ game, onPress }: { game: Game, onPress: () => void }) {
  const imageUrl = game.background_image || "https://via.placeholder.com/100x100?text=No+Image";
  const year = game.released ? game.released.split("-")[0] : "Unknown";
  const rating = game.rating ? game.rating.toFixed(1) : "N/A";
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{game.name}</Text>
        <Text style={styles.sub}>{year} • ⭐ {rating}</Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#1c1c1e", borderRadius: 12, marginBottom: 12, overflow: "hidden" },
  image: { width: 100, height: 100, backgroundColor: "#333" },
  info: { flex: 1, padding: 12, justifyContent: "center" },
  title: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  sub: { color: "#aaa", fontSize: 13 },
});
