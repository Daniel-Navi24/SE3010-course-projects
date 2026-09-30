import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { loadCrimes } from "../utils/storage";
import { Crime } from "../types/Crime";
import { ScreenHeader } from "../components/ScreenHeader";
import { CrimeListItem } from "../components/CrimeListItem";

export default function IndexScreen() {
  const { theme } = useTheme();
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const data = await loadCrimes();
        if (active) {
          setCrimes(data);
          setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Criminal Intent"
        showBack={false}
        actions={[
          { icon: "plus", label: "New crime", onPress: () => router.push("/detail") },
          { icon: "cog", label: "Settings", onPress: () => router.push("/settings") },
        ]}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={theme.text} />
      ) : (
        <FlatList
          data={crimes}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CrimeListItem
              crime={item}
              onPress={() =>
                router.push({ pathname: "/detail", params: { id: item.id } })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.subtext }]}>
              No crimes yet. Tap + to add one.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16 },
});
