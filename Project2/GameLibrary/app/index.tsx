import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useLibrary } from "../context/LibraryContext";
import { applyFilter } from "../utils/storage";
import { ScreenHeader } from "../components/ScreenHeader";
import { GameCard } from "../components/GameCard";
import { FilterChips } from "../components/FilterChips";

export default function CollectionScreen() {
  const { theme } = useTheme();
  const { games, ready, filter, setFilter, query, setQuery } = useLibrary();

  const shown = applyFilter(games, filter, query);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Game Library"
        showBack={false}
        actions={[
          { icon: "book-open-variant", label: "Journal", onPress: () => router.push("/journal") },
          { icon: "plus", label: "Add game", onPress: () => router.push("/detail") },
          { icon: "cog", label: "Settings", onPress: () => router.push("/settings") },
        ]}
      />

      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your library…"
            placeholderTextColor={theme.subtext}
            style={[
              styles.search,
              {
                color: theme.text,
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          />
        </View>

        <FilterChips value={filter} onChange={setFilter} />

        {!ready ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={theme.text} />
        ) : (
          <FlatList
            data={shown}
            keyExtractor={(g) => g.id}
            numColumns={2}
            renderItem={({ item }) => (
              <GameCard
                game={item}
                onPress={() =>
                  router.push({ pathname: "/detail", params: { id: item.id } })
                }
              />
            )}
            contentContainerStyle={{ padding: 6, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={[styles.empty, { color: theme.subtext }]}>
                {games.length === 0
                  ? "Your shelf is empty. Tap + to add your first game."
                  : "No games match your filter."}
              </Text>
            }
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrap: { paddingHorizontal: 12, paddingTop: 12 },
  search: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16, paddingHorizontal: 24 },
});
