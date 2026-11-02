import React from "react";
import { Text, ImageBackground, Pressable, StyleSheet } from "react-native";
import { Genre } from "../types/Game";

export function GenreCard({ genre, onPress }: { genre: Genre, onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}>
      <ImageBackground source={{ uri: genre.image_background }} style={styles.bg} imageStyle={{ borderRadius: 12 }}>
        <Text style={styles.text}>{genre.name}</Text>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, height: 100, margin: 6, borderRadius: 12, overflow: "hidden" },
  bg: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#333" },
  text: { color: "#fff", fontSize: 18, fontWeight: "800", textShadowColor: "#000", textShadowRadius: 4 },
});
