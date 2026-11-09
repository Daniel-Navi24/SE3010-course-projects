import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getDealDetails } from "../utils/rawg";
import { ScreenHeader } from "../components/ScreenHeader";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getDealDetails(id).then(data => {
        setDeal(data);
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Deal Details" />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.title}>{deal?.info?.title || "Unknown Game"}</Text>
          <Text style={styles.price}>Best Price: ${deal?.cheapestPrice?.price || "N/A"}</Text>
          <Text style={styles.meta}>Retail Price: ${deal?.cheapestPrice?.retailPrice || "N/A"}</Text>
          <Text style={styles.meta}>Savings: {deal?.cheapestPrice?.savings || "0"}%</Text>
          
          <Text style={styles.sectionTitle}>Available at:</Text>
          {deal?.deals?.map((store: any) => (
            <View key={store.storeID} style={styles.storeRow}>
              <Text style={styles.storeName}>Store ID: {store.storeID}</Text>
              <Text style={styles.storePrice}>${store.price}</Text>
            </View>
          ))}
          
          <Pressable onPress={() => router.push("/")} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Back to Search</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  title: { color: "#fff", fontSize: 24, fontWeight: "800", marginBottom: 10 },
  price: { color: "#4cd964", fontSize: 24, fontWeight: "700", marginBottom: 5 },
  meta: { color: "#aaa", fontSize: 16, marginBottom: 5 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 20, marginBottom: 10 },
  storeRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#333" },
  storeName: { color: "#aaa", fontSize: 16 },
  storePrice: { color: "#fff", fontSize: 16, fontWeight: "600" },
  backBtn: { marginTop: 30, backgroundColor: "#1c1c1e", padding: 16, borderRadius: 8, alignItems: "center" },
  backBtnText: { color: "#fff", fontWeight: "700" },
});
