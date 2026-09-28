import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { loadCrimes } from "../utils/storage";
import { Crime } from "../types/Crime";
import { ScreenHeader } from "../components/ScreenHeader";

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

  const renderItem = ({ item }: { item: Crime }) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/detail", params: { id: item.id } })
      }
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {item.title || "(untitled)"}
        </Text>
        <Text style={[styles.date, { color: theme.subtext }]}>
          {item.date}
        </Text>
      </View>

      {item.solved && (
        <MaterialCommunityIcons
          name="handcuffs"
          size={26}
          color={theme.text}
          style={{ marginLeft: 12 }}
        />
      )}
    </Pressable>
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
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.subtext }]}>
              No crimes yet. Tap + to add one.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  date: { fontSize: 14 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16 },
});
