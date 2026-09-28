import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabParamList, ColoniesStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { coloniesService, Colony } from "../services/coloniesService";

export default function HomeScreen() {
  const { logout } = useAuth();
  type HomeNavProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, "home">,
    NativeStackNavigationProp<ColoniesStackParamList>
  >;
  const navigation = useNavigation<HomeNavProp>();
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [pending, setPending] = useState<Colony[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [allColonies, pendingColonies] = await Promise.all([
        coloniesService.getAll(),
        coloniesService.getPending(3),
      ]);
      setColonies(allColonies);
      setPending(pendingColonies);
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  const totalGatos = colonies.reduce((acc, c) => acc + c.estimated_cats, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#E85D04" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E85D04"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>🐱 ColonyCare</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.cardBlue]}>
            <Text style={styles.statNumber}>{colonies.length}</Text>
            <Text style={styles.statLabel}>Colonias</Text>
          </View>
          <View style={[styles.statCard, styles.cardOrange]}>
            <Text style={styles.statNumber}>{totalGatos}</Text>
            <Text style={styles.statLabel}>Gatos estimados</Text>
          </View>
          <View
            style={[
              styles.statCard,
              pending.length > 0 ? styles.cardRed : styles.cardGreen,
            ]}
          >
            <Text style={styles.statNumber}>{pending.length}</Text>
            <Text style={styles.statLabel}>Sin visitar</Text>
          </View>
        </View>
        {pending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Pendientes de visita</Text>
            {pending.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.pendingCard}
                onPress={() =>
                  navigation.navigate("colonies", {
                    screen: "colony-detail",
                    params: { colonyId: c.id, returnTo: "home" },
                  })
                }
              >
                <Text style={styles.pendingName}>{c.name}</Text>
                <Text style={styles.pendingDetail}>
                  📍 {c.location} · 🐱 {c.estimated_cats} gatos
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏘️ Mis Colonias</Text>
          {colonies.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                No hay colonias registradas aún.
              </Text>
            </View>
          ) : (
            colonies.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.colonyCard}
                onPress={() =>
                  navigation.navigate("colonies", {
                    screen: "colony-detail",
                    params: { colonyId: c.id, returnTo: "home" },
                  })
                }
              >
                <View style={styles.colonyInfo}>
                  <Text style={styles.colonyName}>{c.name}</Text>
                  <Text style={styles.colonyLocation}>📍 {c.location}</Text>
                </View>
                <View style={styles.colonyBadge}>
                  <Text style={styles.colonyBadgeText}>
                    {c.estimated_cats} 🐱
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  greeting: { fontSize: 26, fontWeight: "800", color: "#1A1A2E" },
  date: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
    textTransform: "capitalize",
  },
  logoutBtn: {
    backgroundColor: "#E85D04",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  statCard: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
  cardBlue: { backgroundColor: "#007AFF" },
  cardOrange: { backgroundColor: "#E85D04" },
  cardRed: { backgroundColor: "#D32F2F" },
  cardGreen: { backgroundColor: "#2E7D32" },
  statNumber: { fontSize: 26, fontWeight: "900", color: "#FFF" },
  statLabel: { fontSize: 10, color: "#FFF", marginTop: 4, textAlign: "center" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  pendingCard: {
    backgroundColor: "#FFF3F3",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },
  pendingName: { fontSize: 15, fontWeight: "700", color: "#1A1A2E" },
  pendingDetail: { fontSize: 12, color: "#666", marginTop: 4 },
  colonyCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  colonyInfo: { flex: 1 },
  colonyName: { fontSize: 15, fontWeight: "700", color: "#1A1A2E" },
  colonyLocation: { fontSize: 12, color: "#999", marginTop: 3 },
  colonyBadge: {
    backgroundColor: "#FFF0E8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  colonyBadgeText: { fontSize: 13, fontWeight: "700", color: "#E85D04" },
  emptyBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyText: { color: "#999", fontSize: 14 },
});
