import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, PanResponder, Animated, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ColoniesStackParamList } from "../navigation/types";
import { coloniesService, Colony } from "../services/coloniesService";
import { useToast } from "react-native-toast-notifications";
import { usePermissions } from "../hooks/usePermissions";

const SWIPE_THRESHOLD = 60;
const DELETE_BTN_WIDTH = 80;

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
    <View style={styles.swipeContainer}>
      {canDelete && (
        <View style={styles.deleteAction}>
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteBtnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardText}>{item.location}</Text>
          <Text style={styles.cardText}>{item.estimated_cats || 0} gatos</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function ColoniesScreen() {
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { canDeleteColony } = usePermissions();

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
    Alert.alert("Eliminar colonia", `¿Seguro que quieres eliminar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try {
          const message = await coloniesService.delete(id);
          setColonies((prev) => prev.filter((c) => c.id !== id));
          toast.show(message || "Colonia eliminada correctamente", { type: "success", duration: 2000 });
        } catch (error: any) {
          const msg = error?.response?.data?.message || "No se pudo eliminar la colonia";
          toast.show(msg, { type: "danger", duration: 2000 });
        }
      }},
    ]);
  }, [toast]);

  useEffect(() => { loadColonies(); }, [loadColonies]);
  useFocusEffect(React.useCallback(() => { loadColonies(); }, [loadColonies]));

  if (loading && !refreshing)
    return <View style={styles.centerLoader}><ActivityIndicator size="large" color="#E85D04" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Colonias</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("colony-create" as never)}>
          <Text style={styles.addBtnText}>Crear colonia</Text>
        </TouchableOpacity>
      </View>
      {colonies.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>No hay colonias todavía</Text></View>
      ) : (
        <FlatList data={colonies} keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#1A1A2E" },
  addBtn: { backgroundColor: "#E85D04", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  addBtnText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  swipeContainer: { marginVertical: 8, position: "relative" },
  deleteAction: { position: "absolute", right: 0, top: 0, bottom: 0, width: DELETE_BTN_WIDTH, justifyContent: "center", alignItems: "center", backgroundColor: "#FF3B30", borderRadius: 12 },
  deleteBtn: { justifyContent: "center", alignItems: "center", width: DELETE_BTN_WIDTH, flex: 1 },
  deleteBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  card: { backgroundColor: "#FFF", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#E85D04" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 },
  cardText: { fontSize: 13, color: "#666", marginBottom: 4 },
  centerLoader: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 14, color: "#999" },
});
