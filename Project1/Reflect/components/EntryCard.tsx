import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import type { Entry } from "../utils/storage";

const MOOD_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  great: "happy",
  good: "happy-outline",
  okay: "remove-circle-outline",
  sad: "sad-outline",
  awful: "rainy",
};

type Props = {
  entry: Entry;
  highlighted?: boolean;
};

export default function EntryCard({ entry, highlighted = false }: Props) {
  const time = new Date(entry.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View style={[styles.card, highlighted && styles.highlighted]}>
      <View style={styles.header}>
        <Ionicons name={MOOD_ICON[entry.mood]} size={22} color={colors.primary} />
        <Text style={styles.mood}>{entry.mood}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.text}>{entry.text}</Text>
      {highlighted && <Text style={styles.newLabel}>Newest entry</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlighted: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  mood: {
    marginLeft: 8,
    fontWeight: "600",
    color: colors.text,
    textTransform: "capitalize",
    flex: 1,
  },
  time: { fontSize: 12, color: colors.subtext },
  text: { color: colors.text, fontSize: 15, lineHeight: 21 },
  newLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
});
