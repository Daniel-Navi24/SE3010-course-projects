import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { getCrime, upsertCrime } from "../utils/storage";
import { newId } from "../utils/uuid";
import { Crime } from "../types/Crime";
import { ScreenHeader } from "../components/ScreenHeader";
import { PhotoField } from "../components/PhotoField";
import { LabeledInput } from "../components/LabeledInput";
import { DateField } from "../components/DateField";
import { SolvedField } from "../components/SolvedField";
import { SaveButton } from "../components/SaveButton";

export default function DetailScreen() {
  const { theme } = useTheme();
  const { id: existingId } = useLocalSearchParams<{ id?: string }>();

  const [crimeId, setCrimeId] = useState<string | null>(existingId ?? null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());
  const [solved, setSolved] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      if (!existingId) return;
      const c = await getCrime(existingId);
      if (!c) return;
      setCrimeId(c.id);
      setTitle(c.title);
      setDetails(c.details);
      setDate(new Date(c.date));
      setSolved(c.solved);
      setPhotoUri(c.photoUri);
    })();
  }, [existingId]);

  const onSave = async () => {
    const id = crimeId ?? newId();
    const crime: Crime = {
      id,
      title,
      details,
      date: date.toISOString(),
      solved,
      photoUri,
    };
    await upsertCrime(crime);
    setCrimeId(id);
    setSaved(true);
    Alert.alert("Saved", "Your crime has been saved.", [{ text: "OK" }]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Crime Detail"
        actions={[
          {
            icon: "cog",
            label: "Settings",
            onPress: () => router.push("/settings"),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <PhotoField photoUri={photoUri} onChange={setPhotoUri} />
          <View style={styles.titleColumn}>
            <LabeledInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
            />
          </View>
        </View>

        <LabeledInput
          label="Details"
          value={details}
          onChangeText={setDetails}
          placeholder="What happened?"
          multiline
        />

        <DateField value={date} onChange={setDate} />

        <View style={{ marginBottom: 24 }}>
          <SolvedField value={solved} onChange={setSolved} />
        </View>

        <SaveButton onPress={onSave} />

        {saved && (
          <Text style={[styles.savedHint, { color: theme.subtext }]}>
            Saved ✓
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  topRow: { flexDirection: "row", marginBottom: 16 },
  titleColumn: { flex: 1, justifyContent: "flex-end" },
  savedHint: { textAlign: "center", marginTop: 12, fontSize: 14 },
});
