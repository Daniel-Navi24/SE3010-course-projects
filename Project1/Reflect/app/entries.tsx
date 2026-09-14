import { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import EntryCard from "../components/EntryCard";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { loadEntries, groupByDate, Entry } from "../utils/storage";

export default function Entries() {
  const router = useRouter();
  const { highlight } = useLocalSearchParams<{ highlight?: string }>();
  const [entries, setEntries] = useState<Entry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadEntries().then(setEntries);
    }, [])
  );

  const grouped = groupByDate(entries);
  const dates = Object.keys(grouped);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Your Journal" subtitle={`${entries.length} entries`} />

        {highlight ? (
          <Text style={styles.feedback}>
            Your newest entry is highlighted below.
          </Text>
        ) : null}

        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No entries yet.</Text>
            <Text style={styles.emptySub}>
              Go back and write your first one.
            </Text>
          </View>
        ) : (
          dates.map((dateLabel) => (
            <View key={dateLabel} style={{ marginBottom: 8 }}>
              <Text style={styles.dateHeader}>{dateLabel}</Text>
              {grouped[dateLabel].map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  highlighted={entry.id === highlight}
                />
              ))}
            </View>
          ))
        )}

        <View style={{ height: 12 }} />

        <PrimaryButton
          label="Write a new entry"
          icon="create-outline"
          onPress={() => router.push("/")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  feedback: {
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 8,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 16, color: colors.text, fontWeight: "600" },
  emptySub: { fontSize: 14, color: colors.subtext, marginTop: 6 },
});
