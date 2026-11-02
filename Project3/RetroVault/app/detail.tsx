import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getGameDetails } from "../utils/rawg";
import { ScreenHeader } from "../components/ScreenHeader";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getGameDetails(id).then(data => {
        setGame(data);
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <ScreenHeader title={game?.name || "Loading..."} />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Image source={{ uri: game.background_image }} style={styles.hero} />
          <View style={{ padding: 16 }}>
            <Text style={styles.title}>{game.name}</Text>
            <Text style={styles.meta}>⭐ {game.rating} • {game.released} • {game.genres.map((g: any) => g.name).join(", ")}</Text>
            
            <Text style={styles.descTitle}>About</Text>
            <Text style={styles.desc}>{game.description_raw}</Text>

            {game.screenshots?.length > 0 && (
              <>
                <Text style={styles.descTitle}>Screenshots</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  {game.screenshots.map((shot: any) => (
                    <Image key={shot.id} source={{ uri: shot.image }} style={styles.shot} />
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  hero: { width: "100%", height: 250 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800", marginBottom: 8 },
  meta: { color: "#aaa", fontSize: 14, marginBottom: 20 },
  descTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 16, marginBottom: 8 },
  desc: { color: "#ccc", fontSize: 15, lineHeight: 22 },
  shot: { width: 280, height: 160, borderRadius: 8, marginRight: 10 },
});
