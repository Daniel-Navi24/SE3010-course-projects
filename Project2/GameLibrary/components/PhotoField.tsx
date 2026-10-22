import React from "react";
import { View, Image, Pressable, StyleSheet, Alert, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";

type Props = {
  photoUri?: string;
  onChange: (uri: string | undefined) => void;
  aspectRatio?: number;
};

export function PhotoField({ photoUri, onChange, aspectRatio = 1 }: Props) {
  const { theme } = useTheme();

  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to pick a cover.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      aspect: [3, 4],
    });
    if (!result.canceled && result.assets.length > 0) {
      onChange(result.assets[0].uri);
    }
  };

  const clear = () => {
    if (!photoUri) return;
    Alert.alert("Remove cover?", "This will clear the image.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => onChange(undefined) },
    ]);
  };

  return (
    <View style={styles.column}>
      <Pressable
        onPress={clear}
        style={[
          styles.box,
          {
            aspectRatio,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons
              name="image-outline"
              size={40}
              color={theme.subtext}
            />
            <Text style={{ color: theme.subtext, fontSize: 12, marginTop: 6 }}>
              Tap to view
            </Text>
          </View>
        )}
      </Pressable>

      <Pressable
        onPress={pick}
        style={({ pressed }) => [
          styles.camera,
          {
            backgroundColor: theme.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons name="camera" size={22} color={theme.onPrimary} />
        <Text style={{ color: theme.onPrimary, fontWeight: "600", marginLeft: 6 }}>
          {photoUri ? "Change" : "Add cover"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  column: { marginBottom: 16 },
  box: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: { width: "100%", height: "100%" },
  placeholder: { alignItems: "center", justifyContent: "center" },
  camera: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

