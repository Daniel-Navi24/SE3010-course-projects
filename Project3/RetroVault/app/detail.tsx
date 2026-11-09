import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Pressable, Image } from "react-native";
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
      ) : !deal ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load details for this game.</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {deal.info?.thumb && (
            <Image source={{ uri: deal.info.thumb }} style={styles.heroImage} />
          )}
          <Text style={styles.title}>{deal.info?.title || "Unknown Game"}</Text>
          <Text style={styles.price}>Best Price: ${deal.cheapestPrice?.price || "N/A"}</Text>
          <Text style={styles.meta}>Retail Price: ${deal.cheapestPrice?.retailPrice || "N/A"}</Text>
          
          <Text style={styles.sectionTitle}>Available at:</Text>
          {deal.deals && deal.deals.length > 0 ? (
            deal.deals.map((store: any, index: number) => (
              <View key={index} style={styles.storeRow}>
                <Text style={styles.storeName}>Store ID: {store.storeID}</Text>
                <Text style={styles.storePrice}>${store.price}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#aaa" }}>No store data available.</Text>
          )}
          
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Back to Search</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "#ff4444", fontSize: 18, marginBottom: 20, textAlign: "center" },
  heroImage: { width: "100%", height: 200, borderRadius: 12, marginBottom: 16 },
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
