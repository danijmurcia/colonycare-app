import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleLogout = () => {
    Alert.alert("Cerrar sesion", "Seguro que quieres cerrar sesion?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesion", style: "destructive", onPress: logout },
    ]);
  };

  const handleEdit = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setPhone(user?.phone || "");
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    if (!firstName.trim()) {
      toast.show("El nombre es obligatorio", { type: "danger" });
      return;
    }
    setIsSaving(true);
    try {
      await authService.updateMe({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      });
      await refreshUser();
      setIsEditing(false);
      toast.show("Perfil actualizado correctamente", { type: "success" });
    } catch {
      toast.show("Error al actualizar el perfil", { type: "danger" });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Mi Perfil</Text>
        <View style={styles.avatarBox}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.name}>
          {user?.first_name || "Usuario"} {user?.last_name || ""}
        </Text>
        {user?.is_superuser && (
          <View style={styles.superuserBadge}>
            <Text style={styles.badgeText}>SUPERADMIN</Text>
          </View>
        )}
        {isEditing ? (
          <View style={styles.editBox}>
            <Text style={styles.editTitle}>Editar perfil</Text>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Nombre"
              placeholderTextColor="#999"
            />
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Apellido"
              placeholderTextColor="#999"
            />
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>Guardar cambios</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Correo electrónico</Text>
              <Text style={styles.value}>{user?.email || "N/A"}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Estado</Text>
              <Text style={styles.value}>
                {user?.is_active ? "Activo" : "Inactivo"}
              </Text>
            </View>
            {user?.phone ? (
              <View style={styles.infoBox}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{user.phone}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
              <Text style={styles.editBtnText}>✏️ Editar perfil</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scroll: { paddingBottom: 20 },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarBox: { alignItems: "center", marginBottom: 16 },
  avatar: {
    fontSize: 72,
    backgroundColor: "#E85D04",
    width: 120,
    height: 120,
    borderRadius: 60,
    textAlign: "center",
    textAlignVertical: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 8,
  },
  superuserBadge: { alignItems: "center", marginBottom: 20 },
  badgeText: {
    backgroundColor: "#D32F2F",
    color: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "700",
  },
  content: { paddingHorizontal: 16 },
  infoBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#E85D04",
  },
  label: { fontSize: 12, fontWeight: "600", color: "#999", marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  editBtn: {
    backgroundColor: "#E85D04",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  editBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  editBox: { paddingHorizontal: 16 },
  editTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#1A1A2E",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  saveBtn: {
    backgroundColor: "#E85D04",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  cancelBtn: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnText: { color: "#555", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    backgroundColor: "#D32F2F",
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  logoutText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
