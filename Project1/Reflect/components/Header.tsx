import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  sub: { fontSize: 15, color: colors.subtext, marginTop: 4 },
});
