import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import type { Mood } from "../utils/storage";

const OPTIONS: { mood: Mood; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { mood: "great", icon: "happy", color: "#7BC47F" },
  { mood: "good", icon: "happy-outline", color: "#A7C4D9" },
  { mood: "okay", icon: "remove-circle-outline", color: "#C9B27E" },
  { mood: "sad", icon: "sad-outline", color: "#9B8FB5" },
  { mood: "awful", icon: "rainy", color: "#8A8A8A" },
];

export default function MoodPicker({
  value,
  onChange,
}: {
  value: Mood | null;
  onChange: (m: Mood) => void;
}) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const selected = value === opt.mood;
        return (
          <Pressable
            key={opt.mood}
            onPress={() => onChange(opt.mood)}
            style={[
              styles.item,
              selected && { backgroundColor: opt.color + "33", borderColor: opt.color },
            ]}
          >
            <Ionicons name={opt.icon} size={30} color={opt.color} />
            <Text style={[styles.label, selected && { color: colors.text, fontWeight: "600" }]}>
              {opt.mood}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
  item: {
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    flex: 1,
    marginHorizontal: 3,
  },
  label: { fontSize: 11, marginTop: 4, color: colors.subtext },
});
