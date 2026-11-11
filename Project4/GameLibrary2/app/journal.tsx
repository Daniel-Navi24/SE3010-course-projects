import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, FlatList, Keyboard, Platform, ScrollView } from "react-native";
import { useAudioRecorder, AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLibrary } from "../context/LibraryContext";
import { Session } from "../types/Session";
import { newId } from "../utils/uuid";
import { ScreenHeader } from "../components/ScreenHeader";
import { ScreenContainer } from "../components/ScreenContainer";
import { loadSessions, saveSession } from "../utils/storage";

function AudioPlayerButton({ uri, theme }: { uri: string, theme: any }) {
  const player = useAudioPlayer({ uri });
  return (
    <Pressable onPress={() => player.play()} style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 6 }}>
      <MaterialCommunityIcons name="play-circle" size={20} color={theme.primary} />
      <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 13 }}>Play Voice Note</Text>
    </Pressable>
  );
}

export default function JournalScreen() {
  const { theme } = useTheme();
  const { games } = useLibrary();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [gameTitle, setGameTitle] = useState("");
  const [note, setNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [lastAudioUri, setLastAudioUri] = useState<string | undefined>(undefined);
  const [showGrassModal, setShowGrassModal] = useState(false);
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(gameTitle.toLowerCase()) && g.title !== gameTitle
  );

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    loadSessions().then(setSessions);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) return Alert.alert("Error", "Microphone permission needed.");
      
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
    } catch (err) {
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    await recorder.stop();
    setIsRecording(false);
    if (recorder.uri) setLastAudioUri(recorder.uri);
  };

  const handleSave = async () => {
    if (!gameTitle.trim()) {
      return Alert.alert("Wait", "Which game did you play?");
    }
    Keyboard.dismiss();
    setShowSuggestions(false);

    let audioUri = lastAudioUri;
    if (isRecording) {
      await recorder.stop();
      setIsRecording(false);
      audioUri = recorder.uri || undefined;
    }

    const newSession: Session = {
      id: newId(),
      date: new Date().toISOString(),
      gameTitle: gameTitle.trim(),
      durationMinutes: 15,
      audioUri,
      note,
    };

    await saveSession(newSession);
    const updated = await loadSessions();
    setSessions(updated);

    const todayMins = updated
      .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    if (todayMins >= 480) setShowGrassModal(true);

    setGameTitle("");
    setNote("");
    setLastAudioUri(undefined);
    Alert.alert("Saved", "Session added to your journal.");
  };

  const renderItem = ({ item }: { item: Session }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{item.gameTitle}</Text>
      <Text style={{ color: theme.subtext, fontSize: 12 }}>{new Date(item.date).toLocaleString()}</Text>
      {item.note ? <Text style={{ color: theme.text, marginTop: 8 }}>{item.note}</Text> : null}
      {item.audioUri && <AudioPlayerButton uri={item.audioUri} theme={theme} />}
    </View>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Progression Journal" showBack={false} />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      >
        <View style={{ padding: 20, paddingBottom: 0, zIndex: 10 }}>
          <Text style={[styles.label, { color: theme.text }]}>Log a Session</Text>
          
          <View style={{ zIndex: 10 }}>
            <TextInput
              value={gameTitle}
              onChangeText={(t) => { setGameTitle(t); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Which game?"
              placeholderTextColor={theme.subtext}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            />
            {showSuggestions && filteredGames.length > 0 && (
              <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {filteredGames.slice(0, 4).map(g => (
                  <Pressable
                    key={g.id}
                    onPress={() => { setGameTitle(g.title); setShowSuggestions(false); Keyboard.dismiss(); }}
                    style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
                  >
                    <Text style={{ color: theme.text }}>{g.title}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="How did it go?"
            placeholderTextColor={theme.subtext}
            multiline
            style={[styles.input, { color: theme.text, borderColor: theme.border, minHeight: 60 }]}
          />
          
          <View style={styles.row}>
            <Pressable
              onPress={isRecording ? stopRecording : startRecording}
              style={[styles.recordBtn, { backgroundColor: isRecording ? "#C62828" : theme.primary }]}
            >
              <MaterialCommunityIcons name={isRecording ? "stop" : "microphone"} size={20} color="#fff" />
              <Text style={styles.btnText}>{isRecording ? `Stop (${recordingTime}s)` : "Record"}</Text>
            </Pressable>

            <Pressable onPress={handleSave} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
              <Text style={{ color: theme.onPrimary, fontWeight: "600" }}>Save</Text>
            </Pressable>
          </View>
        </View>

        <Text style={[styles.label, { color: theme.text, marginLeft: 20, marginTop: 20 }]}>Past Sessions</Text>
        <FlatList
          data={sessions}
          keyExtractor={s => s.id}
          renderItem={renderItem}
          scrollEnabled={false} // Let the ScrollView handle it
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          ListEmptyComponent={<Text style={{ color: theme.subtext }}>No sessions logged yet.</Text>}
        />
      </ScrollView>

      {showGrassModal && (
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={{ fontSize: 48, textAlign: "center" }}>🌱</Text>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Have you touched grass?</Text>
            <Text style={{ color: theme.subtext, textAlign: "center", marginVertical: 12 }}>
              You've been gaming for over 8 hours today. Maybe go for a walk?
            </Text>
            <Pressable onPress={() => setShowGrassModal(false)} style={{ backgroundColor: theme.primary, padding: 12, borderRadius: 8, alignItems: "center" }}>
              <Text style={{ color: theme.onPrimary, fontWeight: "bold" }}>I promise I will</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  recordBtn: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8, gap: 8 },
  saveBtn: { flex: 1, alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "600" },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  dropdown: { position: "absolute", top: 50, left: 0, right: 0, borderWidth: 1, borderRadius: 8, maxHeight: 150 },
  dropdownItem: { padding: 12, borderBottomWidth: 1 },
  modalBg: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 24 },
  modalBox: { padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 24, fontWeight: "800", textAlign: "center", marginTop: 8 },
});
