import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";
import { getCrime, upsertCrime } from "../utils/storage";
import { newId } from "../utils/uuid";
import { Crime } from "../types/Crime";
import { ScreenHeader } from "../components/ScreenHeader";

function formatDate(iso: string): string {
  return new Date(iso).toDateString().toUpperCase();
}

export default function DetailScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const existingId = params.id;

  const [crimeId, setCrimeId] = useState<string | null>(existingId ?? null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());
  const [solved, setSolved] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const [showPicker, setShowPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (existingId) {
        const c = await getCrime(existingId);
        if (c) {
          setCrimeId(c.id);
          setTitle(c.title);
          setDetails(c.details);
          setDate(new Date(c.date));
          setSolved(c.solved);
          setPhotoUri(c.photoUri);
        }
      }
      setLoading(false);
    })();
  }, [existingId]);

  const onPickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

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
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.content}
      >
        {loading ? null : (
          <>
            <View style={styles.topRow}>
              <View style={styles.photoColumn}>
                <View
                  style={[
                    styles.photoBox,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                  ) : null}
                </View>

                <Pressable
                  onPress={onPickPhoto}
                  style={({ pressed }) => [
                    styles.cameraBtn,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={28}
                    color={theme.text}
                  />
                </Pressable>
              </View>

              <View style={styles.titleColumn}>
                <Text style={[styles.label, { color: theme.text }]}>Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Title"
                  placeholderTextColor={theme.subtext}
                  style={[
                    styles.input,
                    { color: theme.text, borderBottomColor: theme.border },
                  ]}
                />
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              Details
            </Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder="What happened?"
              placeholderTextColor={theme.subtext}
              multiline
              style={[
                styles.detailsInput,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            />

            <Pressable
              onPress={() => setShowPicker(true)}
              style={({ pressed }) => [
                styles.dateButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.dateButtonText, { color: theme.onPrimary }]}>
                {formatDate(date.toISOString())}
              </Text>
            </Pressable>

            <View style={styles.solvedRow}>
              <Checkbox
                value={solved}
                onValueChange={setSolved}
                color={solved ? theme.primary : theme.border}
              />
              <Text style={[styles.solvedLabel, { color: theme.text }]}>
                Solved
              </Text>
            </View>

            <Pressable
              onPress={onSave}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.saveText, { color: theme.onPrimary }]}>
                SAVE
              </Text>
            </Pressable>

            {saved && (
              <Text style={[styles.savedHint, { color: theme.subtext }]}>
                Saved ✓
              </Text>
            )}

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_event, selected) => {
                  setShowPicker(false);
                  if (selected) setDate(selected);
                }}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  topRow: { flexDirection: "row", marginBottom: 20 },
  photoColumn: { width: 110, marginRight: 16 },
  photoBox: {
    width: 110,
    height: 110,
    borderWidth: 1,
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%" },
  cameraBtn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleColumn: { flex: 1, justifyContent: "flex-end" },
  label: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  input: { fontSize: 16, paddingVertical: 8, borderBottomWidth: 1 },
  sectionLabel: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  detailsInput: {
    minHeight: 120,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  dateButton: {
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  dateButtonText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  solvedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 10,
  },
  solvedLabel: { fontSize: 16 },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  saveText: { fontSize: 16, fontWeight: "700", letterSpacing: 1 },
  savedHint: { textAlign: "center", marginTop: 12, fontSize: 14 },
});
