import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getGamesByGenre } from "../utils/rawg";
import { Game } from "../types/Game";
import { ScreenHeader } from "../components/ScreenHeader";
import { GameCard } from "../components/GameCard";

export default function GamesScreen() {
  const { genreId, genreName } = useLocalSearchParams<{ genreId: string, genreName: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (genreId) {
      getGamesByGenre(Number(genreId)).then(data => {
        setGames(data);
        setLoading(false);
      });
    }
  }, [genreId]);

  return (
    <View style={styles.container}>
      <ScreenHeader title={genreName || "Games"} />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={g => g.id.toString()}
          renderItem={({ item }) => (
            <GameCard 
              game={item} 
              onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })} 
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={{ color: "#aaa", textAlign: "center" }}>No games found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
