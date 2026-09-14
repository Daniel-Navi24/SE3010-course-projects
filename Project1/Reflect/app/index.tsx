import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import MoodPicker from "../components/MoodPicker";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { saveEntry, loadEntries, Mood, Entry } from "../utils/storage";

export default function Home() {
  const router = useRouter();
  const [mood, setMood] = useState<Mood | null>(null);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  useEffect(() => {
    loadEntries().then((entries: Entry[]) => setTotalEntries(entries.length));
  }, [saved]);

  const canSave = mood !== null && text.trim().length > 0;

  const handleSave = async () => {
    if (!canSave || !mood) return;

    const entry: Entry = {
      id: Date.now().toString(),
      mood,
      text: text.trim(),
      date: new Date().toISOString(),
    };

    await saveEntry(entry);
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    setLastSavedId(entry.id);
    setText("");
    setMood(null);
    setSaved((s) => !s);
  };

  const openJournal = () => {
    router.push({
      pathname: "/entries",
      params: {
        highlight: lastSavedId ?? "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Header title="Reflect" subtitle="How are you feeling today?" />

          <Text style={styles.label}>Pick a mood</Text>
          <MoodPicker value={mood} onChange={setMood} />

          <Text style={styles.label}>What's on your mind?</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Write freely. No one else will see this."
            placeholderTextColor={colors.subtext}
            value={text}
            onChangeText={setText}
          />

          {saved && (
            <Text style={styles.feedback}>
              ✓ Entry saved — {totalEntries} total
            </Text>
          )}

          <PrimaryButton
            label="Save Entry"
            icon="checkmark-circle-outline"
            onPress={handleSave}
            disabled={!canSave}
          />

          <View style={{ height: 12 }} />

          <PrimaryButton
            label={`View Journal (${totalEntries})`}
            icon="book-outline"
            onPress={openJournal}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.subtext,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feedback: {
    color: colors.primary,
    fontWeight: "600",
    marginVertical: 10,
  },
});
