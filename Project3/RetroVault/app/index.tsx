import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getGenres } from "../utils/rawg";
import { Genre } from "../types/Game";
import { ScreenHeader } from "../components/ScreenHeader";
import { GenreCard } from "../components/GenreCard";

export default function HomeScreen() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGenres().then(data => {
      setGenres(data);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="RetroVault" showBack={false} />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={genres}
          keyExtractor={g => g.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <GenreCard 
              genre={item} 
              onPress={() => router.push({ pathname: "/games", params: { genreId: item.id, genreName: item.name } })} 
            />
          )}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
