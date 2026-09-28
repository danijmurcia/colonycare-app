import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
  const [pendingTab, setPendingTab] = useState<"daily" | "overdue">("daily");
  const [showStatsInfo, setShowStatsInfo] = useState(false);
  const { stats } = useUserStats();
  const {
    dailyPending,
    overduePending,
    loadingDaily,
    loadingOverdue,
    fetchDaily,
    fetchOverdue,
  } = usePendingColonies();

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

  const handleTabChange = (tab: "daily" | "overdue") => {
    setPendingTab(tab);
    if (tab === "daily") {
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
      <SafeAreaView className="flex-1 bg-slate-50">
        <ActivityIndicator size="large" color="#E85D04" className="flex-1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
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
        <View className="bg-orange-50 px-6 py-4">
          <View>
            <View>
              <Text className="text-2xl font-bold text-orange-600 mb-1">🐱 ColonyCare</Text>
              <Text className="text-sm text-gray-600 mb-3">
                Sistema de gestión felina
              </Text>
              <Text className="text-xs text-gray-500">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Text>
            </View>
            <TouchableOpacity className="bg-orange-600 rounded-lg px-3 py-1.5 items-center justify-center" onPress={logout}>
              <Text className="text-white text-xs font-bold">🚪 Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS PRINCIPALES */}
        <View className="flex-row gap-3 px-6 py-4">
          <TouchableOpacity
            className="flex-1 bg-white rounded-xl p-4 items-center shadow"
            onPress={() =>
              navigation.navigate("colonies", { screen: "colonies-list" })
            }
          >
            <Text className="text-2xl mb-1">🏘️</Text>
            <Text className="text-xl font-black text-[#1A1A2E]">{colonies.length}</Text>
            <Text className="text-xs text-gray-500 font-semibold">Colonias</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 items-center shadow">
            <Text className="text-2xl mb-1">🐱</Text>
            <Text className="text-xl font-black text-[#1A1A2E]">{totalGatos}</Text>
            <Text className="text-xs text-gray-500 font-semibold">Gatos Totales</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 items-center shadow">
            <Text className="text-2xl mb-1">⚠️</Text>
            <Text className="text-xl font-black text-[#1A1A2E]">
              {dailyPending.length + overduePending.length}
            </Text>
            <Text className="text-xs text-gray-500 font-semibold">Pendientes</Text>
          </TouchableOpacity>
        </View>

        {/* PENDIENTES CON TABS */}
        <View className="bg-white rounded-xl mx-6 mb-6 p-4 shadow">
          <Text className="text-base font-black text-[#1A1A2E] mb-3">📋 Visitas Pendientes</Text>
          {/* Tabs */}
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              className={`flex-1 py-2.5 px-3 rounded-xl items-center ${
                pendingTab === "daily" ? "bg-[#E85D04]" : "bg-gray-100"
              }`}
              onPress={() => handleTabChange("daily")}
            >
              <Text className={`text-sm font-bold ${
                pendingTab === "daily" ? "text-white" : "text-gray-500"
              }`}>
                📅 Hoy {dailyPending.length > 0 && `(${dailyPending.length})`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2.5 px-3 rounded-xl items-center ${
                pendingTab === "overdue" ? "bg-[#E85D04]" : "bg-gray-100"
              }`}
              onPress={() => handleTabChange("overdue")}
              disabled={loadingOverdue}
            >
              <Text className={`text-sm font-bold ${
                pendingTab === "overdue" ? "text-white" : "text-gray-500"
              }`}>
                {loadingOverdue ? "⏳" : "⚠️"} 2+ días {overduePending.length > 0 && `(${overduePending.length})`}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Lista según tab activo */}
          {(pendingTab === "daily" ? dailyPending : overduePending)
            .slice(0, 4)
            .map((c) => (
              <TouchableOpacity
                key={c.id}
                className={`flex-row items-center bg-white rounded-xl p-3 mb-2 border-l-4 ${
                  pendingTab === "overdue" ? "border-red-500" : "border-orange-500"
                }`}
                onPress={() =>
                  navigation.navigate("colonies", {
                    screen: "colony-detail",
                    params: { colonyId: c.id, returnTo: "home" },
                  })
                }
              >
                <Text
                  className={`text-xl w-9 h-9 rounded-lg text-center leading-9 mr-3 ${
                    pendingTab === "overdue" ? "bg-red-100" : "bg-orange-50"
                  }`}
                >
                  {pendingTab === "overdue" ? "🔴" : "📌"}
                </Text>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#1A1A2E]">{c.name}</Text>
                  <Text className="text-xs text-gray-500">
                    📍 {c.location} • 🐱 {c.estimated_cats} gatos
                  </Text>
                </View>
                <Text className="text-2xl text-gray-400">›</Text>
              </TouchableOpacity>
            ))}
          {(pendingTab === "daily" ? dailyPending : overduePending).length ===
            0 &&
            !loadingDaily &&
            !loadingOverdue && (
              <View className="py-6 items-center gap-2">
                <Text className="text-3xl">
                  {pendingTab === "daily" ? "🎉" : "✅"}
                </Text>
                <Text className="text-sm text-gray-400 font-semibold text-center">
                  {pendingTab === "daily"
                    ? "Todas las colonias han sido visitadas hoy"
                    : "No hay colonias sin visitar en 2+ días"}
                </Text>
              </View>
            )}
        </View>

        {/* MI RESUMEN - CARD COMPLETO */}
        {stats && (
          <View className="bg-white rounded-lg p-4 shadow m-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-black text-[#1A1A2E]">📊 Mi Resumen</Text>
              <TouchableOpacity
                onPress={() => setShowStatsInfo(true)}
                className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center"
              >
                <Text className="text-orange-500 text-sm font-bold">i</Text>
              </TouchableOpacity>
            </View>
            {/* Fila superior: 3 números */}
            <View className="flex-row justify-around py-4">
              <View className="flex-1 items-center">
                <Text className="text-2xl font-black text-[#E85D04]">{stats.total_visits || 0}</Text>
                <Text className="text-xs text-gray-500 font-semibold mt-1">Visitas</Text>
              </View>
              <View className="w-px bg-gray-100" />
              <View className="flex-1 items-center">
                <Text className="text-2xl font-black text-[#E85D04]">{stats.total_colonies || 0}</Text>
                <Text className="text-xs text-gray-500 font-semibold mt-1">Colonias</Text>
              </View>
              <View className="w-px bg-gray-100" />
              <View className="flex-1 items-center">
                <Text className="text-2xl font-black text-[#E85D04]">
                  {stats.total_colonies ? Math.round(stats.total_visits / stats.total_colonies) : 0}
                </Text>
                <Text className="text-xs text-gray-500 font-semibold mt-1">Promedio de visitas</Text>
              </View>
            </View>

            {/* Separador */}
            <View className="h-px bg-gray-100 my-4" />

            {/* Colonia más visitada */}
            {stats.most_visited && (
              <View className="flex-row items-center gap-3 mb-3">
                <Text className="text-2xl w-10 h-10 bg-orange-50 rounded text-center">🏆</Text>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-400 mb-0.5">Colonia más visitada</Text>
                  <Text className="text-sm font-bold text-[#1A1A2E]">{stats.most_visited.name}</Text>
                </View>
                <Text className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {stats.most_visited.count} visitas
                </Text>
              </View>
            )}

            {/* Última visita */}
            {stats.last_visit && (
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl w-10 h-10 bg-orange-50 rounded text-center">🕒</Text>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-400 mb-0.5">
                    Fecha última visita
                  </Text>
                  <Text className="text-sm font-bold text-[#1A1A2E]">
                    {stats.last_visit.colony}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-gray-500 text-right">
                  {new Date(stats.last_visit.date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* STATS INFO MODAL */}
      {showStatsInfo && (
        <TouchableOpacity
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center"
          onPress={() => setShowStatsInfo(false)}
        >
          <View className="bg-white rounded-xl p-5 mx-5 shadow-lg">
            <TouchableOpacity onPress={() => setShowStatsInfo(false)} className="self-end p-2">
              <Text className="text-xl text-gray-500">✕</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800 mb-4">📊 ¿Qué significan estos datos?</Text>

            <View className="flex-row mb-3">
              <Text className="text-2xl mr-3">📋</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 mb-1">Visitas</Text>
                <Text className="text-xs text-gray-500 leading-5">Total de visitas que has registrado en todas las colonias (compartidas entre todos los usuarios)</Text>
              </View>
            </View>

            <View className="flex-row mb-3">
              <Text className="text-2xl mr-3">🏘️</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 mb-1">Colonias</Text>
                <Text className="text-xs text-gray-500 leading-5">Número de colonias diferentes que has visitado. Las colonias son compartidas entre todos los usuarios</Text>
              </View>
            </View>

            <View className="flex-row mb-3">
              <Text className="text-2xl mr-3">📈</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 mb-1">Prom. visitas</Text>
                <Text className="text-xs text-gray-500 leading-5">Promedio de visitas por colonia. Se calcula: Total visitas ÷ Colonias diferentes</Text>
              </View>
            </View>

            <Text className="text-xs text-gray-400 mt-4 italic">Tus datos son personales. Las colonias se comparten con otros usuarios</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

