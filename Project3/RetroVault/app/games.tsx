import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { getDeals } from "../utils/rawg";
import { Game } from "../types/Game";
import { ScreenHeader } from "../components/ScreenHeader";
import { GameCard } from "../components/GameCard";

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDeals().then(data => {
      setGames(data);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Deals" />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={g => g.id}
          renderItem={({ item }) => (
            <GameCard game={item} onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })} />
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={{ color: "#aaa", textAlign: "center" }}>No deals found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
