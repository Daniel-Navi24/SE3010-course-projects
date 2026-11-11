import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type HeaderAction = {
  icon: IconName;
  label: string;
  onPress: () => void;
};

type Props = {
  title: string;
  // left is a back arrow by default if canGoBack
  showBack?: boolean;
  actions?: HeaderAction[]; // right-side icons
};

export function ScreenHeader({ title, showBack = true, actions = [] }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.primary,
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack && router.canGoBack() ? (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              accessibilityLabel="Back"
              style={({ pressed }) => [
                styles.iconBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color={theme.onPrimary}
              />
            </Pressable>
          ) : null}
        </View>

        <Text
          style={[styles.title, { color: theme.onPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.right}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              onPress={a.onPress}
              hitSlop={12}
              accessibilityLabel={a.label}
              style={({ pressed }) => [
                styles.iconBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <MaterialCommunityIcons
                name={a.icon}
                size={26}
                color={theme.onPrimary}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // The colored bar; paddingTop comes from safe-area insets
  },
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  left: {
    width: 90,
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    width: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  iconBtn: {
    padding: 8,
    marginHorizontal: 4,
  },
});
