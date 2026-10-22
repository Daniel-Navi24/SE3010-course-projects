import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Modal } from "react-native";
import { useAudioRecorder, AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Session } from "../types/Session";
import { newId } from "../utils/uuid";

export function SessionJournal({ sessions, onAddSession }: { sessions: Session[], onAddSession: (s: Session) => void }) {
  const { theme } = useTheme();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [note, setNote] = useState("");
  const [showGrassModal, setShowGrassModal] = useState(false);
  
  const [lastAudioUri, setLastAudioUri] = useState<string | undefined>(undefined);
  const player = useAudioPlayer(lastAudioUri ? { uri: lastAudioUri } : null);

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
      if (!permission.granted) {
        Alert.alert("Permission needed", "Allow microphone access to record.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Could not start recording. Make sure no other app is using the mic.");
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    try {
      await recorder.stop();
      setIsRecording(false);
      const uri = recorder.uri;
      if (uri) setLastAudioUri(uri);
    } catch (err) {
      console.error("Failed to stop", err);
    }
  };

  const handleSave = async () => {
    let audioUri = lastAudioUri;
    if (isRecording) {
      await recorder.stop();
      setIsRecording(false);
      audioUri = recorder.uri || undefined;
      setLastAudioUri(audioUri);
    }

    const today = new Date().toDateString();
    const todayMins = sessions
      .filter(s => new Date(s.date).toDateString() === today)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    if (todayMins + 15 >= 480) {
      setShowGrassModal(true);
    }

    onAddSession({
      id: newId(),
      date: new Date().toISOString(),
      durationMinutes: 15,
      audioUri: audioUri || undefined,
      note,
    });
    
    setNote("");
    setLastAudioUri(undefined);
  };

  const playRecording = () => {
    if (player) {
      player.play();
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={[styles.label, { color: theme.text }]}>Session Journal</Text>

      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="How did the session go?"
        placeholderTextColor={theme.subtext}
        multiline
        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
      />

      <View style={styles.row}>
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.recordBtn, { backgroundColor: isRecording ? "#C62828" : theme.primary }]}
        >
          <MaterialCommunityIcons name={isRecording ? "stop" : "microphone"} size={20} color="#fff" />
          <Text style={styles.btnText}>
            {isRecording ? `Stop (${recordingTime}s)` : "Record Voice"}
          </Text>
        </Pressable>

        <Pressable onPress={handleSave} style={[styles.saveBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={{ color: theme.text, fontWeight: "600" }}>Save Session</Text>
        </Pressable>
      </View>

      {lastAudioUri && (
        <Pressable onPress={playRecording} style={{ flexDirection: "row", alignItems: "center", marginTop: 12, gap: 6 }}>
          <MaterialCommunityIcons name="play-circle" size={24} color={theme.primary} />
          <Text style={{ color: theme.primary, fontWeight: "600" }}>Play recorded audio</Text>
        </Pressable>
      )}

      {sessions.length > 0 && (
        <Text style={{ color: theme.subtext, marginTop: 12 }}>
          {sessions.length} sessions logged today. 
        </Text>
      )}

      <Modal visible={showGrassModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={{ fontSize: 48, textAlign: "center" }}>🌱</Text>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Have you touched grass?</Text>
            <Text style={{ color: theme.subtext, textAlign: "center", marginVertical: 12 }}>
              You've been logging a lot of game sessions today. Maybe go for a walk?
            </Text>
            <Pressable onPress={() => setShowGrassModal(false)} style={{ backgroundColor: theme.primary, padding: 12, borderRadius: 8, alignItems: "center" }}>
              <Text style={{ color: theme.onPrimary, fontWeight: "bold" }}>I'll go outside, I promise</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  recordBtn: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8, gap: 8 },
  saveBtn: { flex: 1, alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 8, borderWidth: 1 },
  btnText: { color: "#fff", fontWeight: "600" },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 24 },
  modalBox: { padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 24, fontWeight: "800", textAlign: "center", marginTop: 8 },
});
