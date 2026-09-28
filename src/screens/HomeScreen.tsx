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
import { useUserStats } from "../hooks/useUserStats";
import { usePendingColonies } from "../hooks/usePendingColonies";

export default function HomeScreen() {
  const { logout } = useAuth();
  type HomeNavProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, "home">,
    NativeStackNavigationProp<ColoniesStackParamList>
  >;
  const navigation = useNavigation<HomeNavProp>();
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingTab, setPendingTab] = useState<'daily' | 'overdue'>('daily');
  const { stats } = useUserStats();
  const { dailyPending, overduePending, loadingDaily, loadingOverdue, fetchDaily, fetchOverdue } = usePendingColonies();

  const fetchData = async () => {
    try {
      const allColonies = await coloniesService.getAll();
      setColonies(allColonies);
      await fetchDaily();
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTabChange = (tab: 'daily' | 'overdue') => {
    setPendingTab(tab);
    if (tab === 'daily') {
      fetchDaily();
    } else {
      fetchOverdue();
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E85D04"
          />
        }
      >
        {/* HEADER MEJORADO */}
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>🐱 ColonyCare</Text>
              <Text style={styles.headerSubtitle}>Sistema de gestión felina</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS PRINCIPALES */}
        <View style={styles.mainStatsGrid}>
          <TouchableOpacity
            style={styles.mainStatCard}
            onPress={() => navigation.navigate('colonies', { screen: 'colonies-list' })}
          >
            <Text style={styles.mainStatIcon}>🏘️</Text>
            <Text style={styles.mainStatNumber}>{colonies.length}</Text>
            <Text style={styles.mainStatLabel}>Colonias</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainStatCard}>
            <Text style={styles.mainStatIcon}>🐱</Text>
            <Text style={styles.mainStatNumber}>{totalGatos}</Text>
            <Text style={styles.mainStatLabel}>Gatos Totales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainStatCard}>
            <Text style={styles.mainStatIcon}>⚠️</Text>
            <Text style={styles.mainStatNumber}>{dailyPending.length + overduePending.length}</Text>
            <Text style={styles.mainStatLabel}>Pendientes</Text>
          </TouchableOpacity>
        </View>

        {/* PENDIENTES CON TABS */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Visitas Pendientes</Text>
            {/* Tabs */}
            <View style={styles.tabsRow}>
              <TouchableOpacity
                style={[styles.tabBtn, pendingTab === 'daily' && styles.tabBtnActive]}
                onPress={() => handleTabChange('daily')}
              >
                <Text style={[styles.tabBtnText, pendingTab === 'daily' && styles.tabBtnTextActive]}>
                  📅 Hoy  {dailyPending.length > 0 && <Text style={styles.tabBadge}>{dailyPending.length}</Text>}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, pendingTab === 'overdue' && styles.tabBtnActive]}
                onPress={() => handleTabChange('overdue')}
                disabled={loadingOverdue}
              >
                <Text style={[styles.tabBtnText, pendingTab === 'overdue' && styles.tabBtnTextActive]}>
                  {loadingOverdue ? '⏳' : '⚠️'} 2+ días  {overduePending.length > 0 && <Text style={styles.tabBadge}>{overduePending.length}</Text>}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Lista según tab activo */}
            {(pendingTab === 'daily' ? dailyPending : overduePending).slice(0, 4).map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.pendingCardNew, pendingTab === 'overdue' && styles.pendingCardOverdue]}
                onPress={() =>
                  navigation.navigate("colonies", {
                    screen: "colony-detail",
                    params: { colonyId: c.id, returnTo: "home" },
                  })
                }
              >
                <Text style={[styles.pendingIconBox, pendingTab === 'overdue' && styles.pendingIconBoxOverdue]}>
                  {pendingTab === 'overdue' ? '🔴' : '📌'}
                </Text>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingName}>{c.name}</Text>
                  <Text style={styles.pendingDetail}>📍 {c.location} • 🐱 {c.estimated_cats} gatos</Text>
                </View>
                <Text style={styles.pendingArrow}>›</Text>
              </TouchableOpacity>
            ))}
            {(pendingTab === 'daily' ? dailyPending : overduePending).length === 0 && !loadingDaily && !loadingOverdue && (
              <View style={styles.emptyTab}>
                <Text style={styles.emptyTabIcon}>
                  {pendingTab === 'daily' ? '🎉' : '✅'}
                </Text>
                <Text style={styles.emptyTabText}>
                  {pendingTab === 'daily'
                    ? 'Todas las colonias han sido visitadas hoy'
                    : 'No hay colonias sin visitar en 2+ días'}
                </Text>
              </View>
            )}
          </View>

        {/* MI RESUMEN - CARD COMPLETO */}
        {stats && (
          <View style={styles.myResumenCard}>
            <Text style={styles.myResumenTitle}>📊 Mi Resumen</Text>
            {/* Fila superior: 3 números */}
            <View style={styles.myResumenGrid}>
              <View style={styles.myResumenItem}>
                <Text style={styles.myResumenBig}>{stats.total_visits || 0}</Text>
                <Text style={styles.myResumenLabel}>Visitas</Text>
              </View>
              <View style={styles.myResumenDivider} />
              <View style={styles.myResumenItem}>
                <Text style={styles.myResumenBig}>{stats.total_colonies || 0}</Text>
                <Text style={styles.myResumenLabel}>Colonias</Text>
              </View>
              <View style={styles.myResumenDivider} />
              <View style={styles.myResumenItem}>
                <Text style={styles.myResumenBig}>
                  {stats.total_colonies ? Math.round(stats.total_visits / stats.total_colonies) : 0}
                </Text>
                <Text style={styles.myResumenLabel}>Prom. visitas</Text>
              </View>
            </View>

            {/* Separador */}
            <View style={styles.myResumenHRule} />

            {/* Colonia más visitada */}
            {stats.most_visited && (
              <View style={styles.myResumenRow}>
                <Text style={styles.myResumenRowIcon}>🏆</Text>
                <View style={styles.myResumenRowInfo}>
                  <Text style={styles.myResumenRowLabel}>Colonia más visitada</Text>
                  <Text style={styles.myResumenRowValue}>{stats.most_visited.name}</Text>
                </View>
                <Text style={styles.myResumenRowBadge}>{stats.most_visited.count} visitas</Text>
              </View>
            )}

            {/* Última visita */}
            {stats.last_visit && (
              <View style={[styles.myResumenRow, { marginBottom: 0 }]}>
                <Text style={styles.myResumenRowIcon}>🕒</Text>
                <View style={styles.myResumenRowInfo}>
                  <Text style={styles.myResumenRowLabel}>Fecha última visita</Text>
                  <Text style={styles.myResumenRowValue}>{stats.last_visit.colony}</Text>
                </View>
                <Text style={styles.myResumenRowDate}>
                  {new Date(stats.last_visit.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  scrollView: { flex: 1, paddingHorizontal: 0 },
  headerGradient: { backgroundColor: "#FFF", paddingTop: 0, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 16, paddingTop: 12 },
  greeting: { fontSize: 28, fontWeight: "900", color: "#1A1A2E", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: "#999", marginTop: 4, fontWeight: "500" },
  date: { fontSize: 12, color: "#BBB", marginTop: 8, textTransform: "capitalize", fontWeight: "500" },
  logoutBtn: { backgroundColor: "#FFE8D6", width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  logoutText: { fontSize: 20 },
  mainStatsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16, marginTop: 24, marginBottom: 24 },
  mainStatCard: { flex: 1, backgroundColor: "#FFF", borderRadius: 16, padding: 18, alignItems: "center", minWidth: "47%", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: "#F0F0F0" },
  mainStatIcon: { fontSize: 32, marginBottom: 12 },
  mainStatNumber: { fontSize: 26, fontWeight: "900", color: "#E85D04", marginBottom: 4 },
  mainStatLabel: { fontSize: 12, fontWeight: "600", color: "#999", textAlign: "center" },
  section: { marginBottom: 28, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A2E", marginBottom: 14, letterSpacing: -0.3 },
  pendingCardNew: { backgroundColor: "#FFF", borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 14, borderLeftWidth: 4, borderLeftColor: "#FF6B6B", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  pendingIconBox: { fontSize: 24, width: 44, height: 44, backgroundColor: "#FFE8E8", borderRadius: 12, textAlign: "center", textAlignVertical: "center" },
  pendingInfo: { flex: 1 },
  pendingName: { fontSize: 15, fontWeight: "700", color: "#1A1A2E", marginBottom: 4 },
  pendingDetail: { fontSize: 12, color: "#999", fontWeight: "500" },
  pendingArrow: { fontSize: 20, color: "#E85D04", fontWeight: "900" },
  myResumenCard: { backgroundColor: "#FFF", borderRadius: 18, padding: 20, marginHorizontal: 16, marginBottom: 28, borderWidth: 1.5, borderColor: "#F0F0F0", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  myResumenTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A2E", marginBottom: 18 },
  myResumenGrid: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  myResumenItem: { flex: 1, alignItems: "center" },
  myResumenLabel: { fontSize: 11, fontWeight: "600", color: "#AAA", marginTop: 4 },
  myResumenBig: { fontSize: 26, fontWeight: "900", color: "#E85D04" },
  myResumenDivider: { width: 1, height: 44, backgroundColor: "#F0F0F0" },
  myResumenHRule: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 16 },
  myResumenRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  myResumenRowIcon: { fontSize: 22, width: 40, height: 40, backgroundColor: "#FFF5EE", borderRadius: 10, textAlign: "center", textAlignVertical: "center" },
  myResumenRowInfo: { flex: 1 },
  myResumenRowLabel: { fontSize: 11, fontWeight: "600", color: "#AAA", marginBottom: 2 },
  myResumenRowValue: { fontSize: 14, fontWeight: "700", color: "#1A1A2E" },
  myResumenRowBadge: { backgroundColor: "#FFF0E8", color: "#E85D04", fontSize: 12, fontWeight: "700", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, overflow: "hidden" },
  myResumenRowDate: { fontSize: 12, fontWeight: "600", color: "#999", textAlign: "right" },
  tabsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#F0F0F0", alignItems: "center" },
  tabBtnActive: { backgroundColor: "#E85D04" },
  tabBtnText: { fontSize: 13, fontWeight: "700", color: "#999" },
  tabBtnTextActive: { color: "#FFF" },
  tabBadge: { fontSize: 12, fontWeight: "800", color: "inherit" },
  pendingCardOverdue: { borderLeftColor: "#FF3B30" },
  pendingIconBoxOverdue: { backgroundColor: "#FFE0E0" },
  emptyTab: { paddingVertical: 24, alignItems: "center", gap: 8 },
  emptyTabIcon: { fontSize: 32 },
  emptyTabText: { fontSize: 14, color: "#AAA", fontWeight: "600", textAlign: "center" },
});
