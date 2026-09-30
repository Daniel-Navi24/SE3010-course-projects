import React from "react";
import { View, Image, Pressable, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";

type Props = {
  photoUri?: string;
  onChange: (uri: string | undefined) => void;
};

export function PhotoField({ photoUri, onChange }: Props) {
  const { theme } = useTheme();

  const pick = async () => {
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
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.column}>
      <View
        style={[
          styles.box,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : null}
      </View>

      <Pressable
        onPress={pick}
        style={({ pressed }) => [
          styles.camera,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons name="camera" size={28} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  column: { width: 110, marginRight: 16 },
  box: { width: 110, height: 110, borderWidth: 1, overflow: "hidden" },
  photo: { width: "100%", height: "100%" },
  camera: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
