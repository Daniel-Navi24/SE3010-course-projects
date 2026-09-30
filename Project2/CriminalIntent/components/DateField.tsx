import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";

type Props = {
  value: Date;
  onChange: (d: Date) => void;
};

function formatDate(d: Date): string {
  return d.toDateString().toUpperCase(); // e.g. TUE FEB 18 2025
}

export function DateField({ value, onChange }: Props) {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);

  const onAndroidChange = (_e: any, selected?: Date) => {
    setShow(false);
    if (selected) onChange(selected);
  };

  const onIOSChange = (_e: any, selected?: Date) => {
    if (selected) onChange(selected);
  };

  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.onPrimary }]}>
          {formatDate(value)}
        </Text>
      </Pressable>

      {/* iOS: use a Modal so the picker is definitely visible above everything */}
      {Platform.OS === "ios" && (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={() => setShow(false)}
        >
          <Pressable
            style={styles.backdrop}
            onPress={() => setShow(false)}
          />
          <View
            style={[
              styles.sheet,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Pressable onPress={() => setShow(false)} hitSlop={12}>
                <Text style={[styles.sheetAction, { color: theme.primary }]}>
                  Done
                </Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              onChange={onIOSChange}
              themeVariant={theme.isDark ? "dark" : "light"}
            />
          </View>
        </Modal>
      )}

      {/* Android: native dialog */}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={onAndroidChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  sheetHeader: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sheetAction: { fontSize: 17, fontWeight: "600" },
});
