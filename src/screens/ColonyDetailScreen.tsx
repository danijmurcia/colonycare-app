import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useToast } from "react-native-toast-notifications";
import { coloniesService } from "../services/coloniesService";
import { visitService } from "../services/visitService";
import { getErrorMessage } from "../utils/errorHandler";
import { ColoniesStackParamList } from "../navigation/types";
import ColonyDetailsTab from "../components/ColonyDetailsTab";
import CatsTab from "../components/CatsTab";
import type { Colony, Visit } from "../types";

type TabName = "detalles" | "gatos";

export default function ColonyDetailScreen() {
  const route = useRoute<RouteProp<ColoniesStackParamList, "colony-detail">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { colonyId } = route.params;
  const [colony, setColony] = useState<Colony | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>("detalles");

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadColonyData();
    }, [colonyId]),
  );

  const loadColonyData = async () => {
    try {
      const [colonyData, visitsData] = await Promise.all([
        coloniesService.getById(colonyId),
        visitService.getByColony(colonyId),
      ]);
      setColony(colonyData);
      setVisits(visitsData || []);
    } catch (error) {
      toast.show(getErrorMessage(error, "Error al cargar colonia"), {
        type: "danger",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#E85D04" />
      </View>
    );
  if (!colony)
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <TouchableOpacity className="p-3" onPress={() => navigation.goBack()}>
          <Text className="text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#1A1A2E] flex-1 text-center">
          {colony.name}
        </Text>
        <View />
      </View>
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === "detalles" ? "border-[#E85D04]" : "border-transparent"}`}
          onPress={() => setActiveTab("detalles")}
        >
          <Text
            className={`font-semibold text-sm ${activeTab === "detalles" ? "text-[#E85D04]" : "text-gray-400"}`}
          >
            Colonia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === "gatos" ? "border-[#E85D04]" : "border-transparent"}`}
          onPress={() => setActiveTab("gatos")}
        >
          <Text
            className={`font-semibold text-sm ${activeTab === "gatos" ? "text-[#E85D04]" : "text-gray-400"}`}
          >
            Gatos
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        {activeTab === "detalles" && (
          <ColonyDetailsTab
            colony={colony}
            visits={visits}
            colonyId={colonyId}
            onColonyDeleted={() => navigation.goBack()}
          />
        )}
        {activeTab === "gatos" && <CatsTab />}
      </View>
    </SafeAreaView>
  );
}
