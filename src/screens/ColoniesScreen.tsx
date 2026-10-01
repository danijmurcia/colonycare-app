import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, PanResponder, Animated, TextInput, TouchableWithoutFeedback, Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ColoniesStackParamList } from "../navigation/types";
import { coloniesService, Colony } from "../services/coloniesService";
import { useToast } from "react-native-toast-notifications";
import { usePermissions } from "../hooks/usePermissions";
import DeleteColonyModal from "../components/DeleteColonyModal";

const SWIPE_THRESHOLD = 60;
const DELETE_BTN_WIDTH = 80;

function formatDaysAgo(date: string | null | undefined): string {
  if (!date) return "Sin visitas";
  const visitDate = new Date(date);
  const today = new Date();
  // Comparar solo fechas (ignorar hora)
  visitDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return `Hace ${diffDays} días`;
}

function SwipeableColonyCard({ item, onPress, onDelete, canDelete }: {
  item: Colony; onPress: () => void; onDelete: () => void; canDelete: boolean;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) => canDelete && Math.abs(gs.dx) > 5 && Math.abs(gs.dy) < 20,
    onPanResponderMove: (_, gs) => {
      const val = isOpen.current ? gs.dx - DELETE_BTN_WIDTH : gs.dx;
      if (val <= 0) translateX.setValue(Math.max(val, -DELETE_BTN_WIDTH));
    },
    onPanResponderRelease: (_, gs) => {
      const val = isOpen.current ? gs.dx - DELETE_BTN_WIDTH : gs.dx;
      if (val < -SWIPE_THRESHOLD) {
        Animated.spring(translateX, { toValue: -DELETE_BTN_WIDTH, useNativeDriver: true }).start();
        isOpen.current = true;
      } else {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        isOpen.current = false;
      }
    },
  })).current;

  return (
    <View className="my-2 relative">
      {canDelete && (
        <View className="absolute right-0 top-0 bottom-0 w-20 justify-center items-center bg-red-500 rounded-xl">
          <TouchableOpacity className="justify-center items-center w-20 flex-1" onPress={onDelete}>
            <Text className="text-white font-bold text-sm">Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <TouchableOpacity className="bg-white rounded-xl p-4 border-l-4 border-[#E85D04]" onPress={onPress} activeOpacity={0.8}>
          <Text className="text-base font-bold text-[#1A1A2E] mb-2">{item.name}</Text>
          <Text className="text-sm text-gray-500 mb-1">{item.location}</Text>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">{item.estimated_cats || 0} gatos</Text>
            <Text className="text-sm text-[#E85D04] font-semibold">Última visita: {formatDaysAgo(item.last_visit_date)}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function ColoniesScreen() {
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { canDeleteColony, canCreateColony } = usePermissions();

  const loadColonies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await coloniesService.getAll();
      setColonies(data || []);
    } catch (error) {
      console.error("Error loading colonies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await coloniesService.getAll();
      setColonies(data || []);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDelete = useCallback((id: number, name: string) => {
    setDeleteTarget({ id, name });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const message = await coloniesService.delete(deleteTarget.id);
      setColonies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.show(message || "Colonia eliminada correctamente", { type: "success", duration: 2000 });
      setDeleteTarget(null);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "No se pudo eliminar la colonia";
      toast.show(msg, { type: "danger", duration: 2000 });
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, toast]);

  useEffect(() => { loadColonies(); }, [loadColonies]);
  useFocusEffect(React.useCallback(() => { loadColonies(); }, [loadColonies]));

  if (loading && !refreshing)
    return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#E85D04" /></View>;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-2xl font-black text-[#1A1A2E]">Colonias</Text>
        {canCreateColony && (
          <TouchableOpacity className="bg-[#E85D04] rounded-lg px-3 py-2" onPress={() => navigation.navigate("colony-create" as never)}>
            <Text className="text-white font-bold text-sm">Crear colonia</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="mx-4 mb-4 px-4 py-3 bg-white rounded-xl border-2 border-[#E85D04] flex-row items-center">
        <Text className="text-xl mr-3">🔍</Text>
        <TextInput
          placeholder="Buscar colonia..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
          className="flex-1 text-base text-[#1A1A2E] font-medium"
        />
      </View>
      {colonies.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase())).length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-sm text-gray-400">{searchText ? "No encontramos colonias" : "No hay colonias todavía"}</Text>
        </View>
      ) : (
        <FlatList data={colonies.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()))} keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E85D04" />}
          renderItem={({ item }) => (
            <SwipeableColonyCard item={item}
              onPress={() => navigation.navigate("colony-detail", { colonyId: item.id })}
              onDelete={() => handleDelete(item.id, item.name)}
              canDelete={canDeleteColony}
            />
          )}
        />
      )}
      </View>
      </TouchableWithoutFeedback>

      <DeleteColonyModal
        visible={deleteTarget !== null}
        colonyName={deleteTarget?.name ?? ''}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}
