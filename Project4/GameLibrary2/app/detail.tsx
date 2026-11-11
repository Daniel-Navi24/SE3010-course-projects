import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, Alert, View, Keyboard, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";
import { useLibrary } from "../context/LibraryContext";
import { getGame } from "../utils/storage";
import { newId } from "../utils/uuid";
import { Game, GameStatus } from "../types/Game";
import { ScreenHeader } from "../components/ScreenHeader";
import { PhotoField } from "../components/PhotoField";
import { LabeledInput } from "../components/LabeledInput";
import { StarRating } from "../components/StarRating";
import { StatusPicker } from "../components/StatusPicker";
import { SaveButton } from "../components/SaveButton";
import { ScreenContainer } from "../components/ScreenContainer";

export default function DetailScreen() {
  const { theme } = useTheme();
  const { id: existingId } = useLocalSearchParams<{ id?: string }>();
  const { saveGame, removeGame, prefs } = useLibrary();

  const [gameId, setGameId] = useState<string | null>(existingId ?? null);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [year, setYear] = useState("");
  const [coverUri, setCoverUri] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<GameStatus>("owned");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [addedAt, setAddedAt] = useState(new Date().toISOString());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      if (!existingId) return;
      const g = await getGame(existingId);
      if (!g) return;
      setGameId(g.id);
      setTitle(g.title);
      setPlatform(g.platform);
      setYear(g.year);
      setCoverUri(g.coverUri);
      setStatus(g.status);
      setRating(g.rating);
      setNotes(g.notes);
      setAddedAt(g.addedAt);
    })();
  }, [existingId]);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Give your game a title first.");
      return;
    }
    Keyboard.dismiss();
    const id = gameId ?? newId();
    const game: Game = {
      id, title: title.trim(), platform: platform.trim(), year: year.trim(),
      coverUri, status, rating, notes: notes.trim(), addedAt
    };
    await saveGame(game);
    setGameId(id);
    setSaved(true);
    if (prefs.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    Alert.alert("Saved", "Your game has been saved.");
  };

  const onDelete = () => {
    if (!gameId) return;
    Alert.alert("Delete this game?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await removeGame(gameId); router.back(); } },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={existingId ? "Edit Game" : "Add Game"} actions={[{ icon: "cog", label: "Settings", onPress: () => router.push("/settings") }]} />
      
      <ScrollView 
        contentContainerStyle={styles.content} 
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"} // Native iOS fix
      >
        <PhotoField photoUri={coverUri} onChange={setCoverUri} aspectRatio={3 / 4} />
        <LabeledInput label="Title" value={title} onChangeText={setTitle} placeholder="e.g. The Legend of Zelda" />
        
        <LabeledInput label="Platform" value={platform} onChangeText={setPlatform} placeholder="e.g. Nintendo Switch" />
        <LabeledInput label="Year" value={year} onChangeText={setYear} placeholder="2023" />

        <Text style={[styles.sectionLabel, { color: theme.text }]}>Status</Text>
        <StatusPicker value={status} onChange={setStatus} />

        <Text style={[styles.sectionLabel, { color: theme.text }]}>Rating</Text>
        <StarRating value={rating} onChange={setRating} />

        <LabeledInput label="Notes" value={notes} onChangeText={setNotes} placeholder="Thoughts..." multiline />

        <View style={{ marginTop: 24 }}>
          <SaveButton onPress={onSave} />
        </View>

        {saved && <Text style={[styles.savedHint, { color: theme.subtext }]}>Saved ✓</Text>}
        {existingId && <Text onPress={onDelete} style={[styles.deleteText, { color: "#C62828" }]}>Delete this game</Text>}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 }, // Normal padding
  sectionLabel: { fontSize: 18, fontWeight: "700", marginBottom: 8, marginTop: 12 },
  savedHint: { textAlign: "center", marginTop: 12, fontSize: 14 },
  deleteText: { textAlign: "center", marginTop: 32, fontSize: 15, fontWeight: "600" },
});
