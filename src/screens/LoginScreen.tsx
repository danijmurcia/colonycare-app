import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { Formik } from "formik";
import * as Yup from "yup";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

interface LoginScreenProps {
  onGoToRegister: () => void;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email no válido")
    .required("El email es requerido"),
  password: Yup.string()
    .min(6, "Mín 6 caracteres")
    .required("La contraseña es requerida"),
});

export default function LoginScreen({ onGoToRegister }: LoginScreenProps) {
  const toast = useToast();

  const { login } = useAuth();

  const handleLoginSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (v: boolean) => void },
  ) => {
    try {
      const response = await authService.login(values.email, values.password);
      await login(response.data.access_token);
      toast.show(response.message, { type: "success", duration: 2000 });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Error en el login";
      toast.show(errorMsg, { type: "danger", duration: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🐱</Text>
          <Text style={styles.title}>ColonyCare</Text>
          <Text style={styles.subtitle}>Gestión de colonias felinas</Text>
        </View>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLoginSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.email && errors.email && styles.inputError,
                ]}
                placeholder="your@email.com"
                placeholderTextColor="#aaa"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>⚠ {errors.email}</Text>
              )}

              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.password && errors.password && styles.inputError,
                ]}
                placeholder="••••••••"
                placeholderTextColor="#aaa"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>⚠ {errors.password}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={onGoToRegister}>
            <Text style={styles.link}>Regístrate</Text>
          </TouchableOpacity>
        </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: { alignItems: "center", marginTop: 24 },
  emoji: { fontSize: 72, marginBottom: 16 },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1A1A2E",
    fontStyle: "italic",
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: "#666666" },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#1A1A2E",
  },
  inputError: { borderColor: "#D32F2F" },
  error: { fontSize: 13, color: "#D32F2F", marginTop: 4, marginBottom: 4 },
  button: {
    backgroundColor: "#E85D04",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 28,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#666666", fontSize: 14 },
  link: { color: "#E85D04", fontWeight: "700", fontSize: 14 },
});
