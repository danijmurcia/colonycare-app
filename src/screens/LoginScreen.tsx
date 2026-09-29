import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Error en el login";
      toast.show(errorMsg, { type: "danger", duration: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-between px-6 py-12">
          <View className="items-center mt-6">
            <Text className="text-8xl mb-4">🐱</Text>
            <Text className="text-5xl font-black text-[#1A1A2E] italic mb-2">ColonyCare</Text>
            <Text className="text-base text-gray-600">Gestión de colonias felinas</Text>
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
                <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Email</Text>
                <TextInput
                  className={`bg-white rounded-xl p-4 border-2 text-base text-[#1A1A2E]${
                    touched.email && errors.email ? ' border-red-600' : ' border-slate-200'
                  }`}
                  placeholder="your@email.com"
                  placeholderTextColor="#aaa"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text className="text-sm text-red-600 mt-1 mb-1">⚠ {errors.email}</Text>
                )}

                <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Contraseña</Text>
                <TextInput
                  className={`bg-white rounded-xl p-4 border-2 text-base text-[#1A1A2E]${
                    touched.password && errors.password ? ' border-red-600' : ' border-slate-200'
                  }`}
                  placeholder="••••••••"
                  placeholderTextColor="#aaa"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureTextEntry
                />
                {touched.password && errors.password && (
                  <Text className="text-sm text-red-600 mt-1 mb-1">⚠ {errors.password}</Text>
                )}

                <TouchableOpacity
                  className={`bg-[#E85D04] rounded-xl p-[18px] items-center mt-7${
                    isSubmitting ? ' opacity-60' : ''
                  }`}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text className="text-white text-[17px] font-bold">
                    {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-sm">¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={onGoToRegister}>
              <Text className="text-[#E85D04] font-bold text-sm">Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
