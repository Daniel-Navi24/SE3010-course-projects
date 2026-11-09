import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getDeals } from "../utils/rawg";
import { Game } from "../types/Game";
import { ScreenHeader } from "../components/ScreenHeader";
import { GameCard } from "../components/GameCard";

const GENRES = ["Action", "RPG", "Shooter", "Strategy", "Adventure", "Puzzle"];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (text: string = query) => {
    if (!text.trim()) return;
    setLoading(true);
    setHasSearched(true);
    const data = await getDeals(text);
    setGames(data);
    setLoading(false);
  };

  const handleGenre = async (genre: string) => {
    setQuery(genre);
    handleSearch(genre);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Game Deals" showBack={false} />
      
      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search games..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        <Pressable onPress={() => handleSearch()} style={styles.searchBtn}>
          <Text style={styles.btnText}>Search</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={GENRES}
        keyExtractor={g => g}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleGenre(item)} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
          </Pressable>
        )}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={g => g.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16 }}>
              <GameCard game={item} onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })} />
            </View>
          )}
          ListEmptyComponent={
            hasSearched ? (
              <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>No games found.</Text>
            ) : (
              <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>Search for a game or tap a genre above.</Text>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  searchRow: { flexDirection: "row", padding: 16, gap: 10 },
  searchInput: { flex: 1, backgroundColor: "#1c1c1e", color: "#fff", padding: 12, borderRadius: 8 },
  searchBtn: { backgroundColor: "#fff", paddingHorizontal: 16, justifyContent: "center", borderRadius: 8 },
  btnText: { color: "#000", fontWeight: "700" },
  chip: { backgroundColor: "#1c1c1e", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, height: 36 },
  chipText: { color: "#fff", fontWeight: "600" },
});
