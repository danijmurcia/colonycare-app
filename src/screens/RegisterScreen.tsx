import React from 'react';
import { View, Text, TextInput, TouchableOpacity,  ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../services/authService';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

const registerSchema = Yup.object().shape({
  first_name: Yup.string().min(2, 'Mínimo 2 caracteres').required('El nombre es requerido'),
  last_name: Yup.string().min(2, 'Mínimo 2 caracteres').required('El apellido es requerido'),
  email: Yup.string().email('Email no válido').required('El email es requerido'),
  phone: Yup.string().optional(),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

export default function RegisterScreen({ onRegisterSuccess, onGoToLogin }: RegisterScreenProps) {
  const toast = useToast();

  const handleRegister = async (
    values: { first_name: string; last_name: string; email: string; phone: string; password: string; confirm_password: string },
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      const response = await authService.register({
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || undefined,
      });
      toast.show(`Bienvenido ${response.first_name}! Cuenta creada correctamente`, { type: 'success', duration: 3000 });
      onRegisterSuccess();
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Error al registrar';
      toast.show(msg, { type: 'danger', duration: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="px-6 py-10" keyboardShouldPersistTaps="handled">
        <View className="items-center mb-8">
          <Text className="text-7xl mb-3">🐱</Text>
          <Text className="text-4xl font-black text-[#1A1A2E] italic mb-1">Crear cuenta</Text>
          <Text className="text-base text-gray-600">Únete a ColonyCare</Text>
        </View>
        <Formik initialValues={{ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '' }} validationSchema={registerSchema} onSubmit={handleRegister}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View>
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Nombre</Text>
              <TextInput className={`bg-white rounded-xl border-2 p-4 text-base text-[#1A1A2E]${touched.first_name && errors.first_name ? ' border-red-600' : ' border-gray-300'}`} placeholder="Introduce tu nombre" placeholderTextColor="#aaa" value={values.first_name} onChangeText={handleChange('first_name')} onBlur={handleBlur('first_name')} />
              {touched.first_name && errors.first_name && <Text className="text-sm text-red-600 mt-1">⚠ {errors.first_name}</Text>}
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Apellido</Text>
              <TextInput className={`bg-white rounded-xl border-2 p-4 text-base text-[#1A1A2E]${touched.last_name && errors.last_name ? ' border-red-600' : ' border-gray-300'}`} placeholder="Introduce tus apellidos" placeholderTextColor="#aaa" value={values.last_name} onChangeText={handleChange('last_name')} onBlur={handleBlur('last_name')} />
              {touched.last_name && errors.last_name && <Text className="text-sm text-red-600 mt-1">⚠ {errors.last_name}</Text>}
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Email</Text>
              <TextInput className={`bg-white rounded-xl border-2 p-4 text-base text-[#1A1A2E]${touched.email && errors.email ? ' border-red-600' : ' border-gray-300'}`} placeholder="tu@email.com" placeholderTextColor="#aaa" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} keyboardType="email-address" autoCapitalize="none" />
              {touched.email && errors.email && <Text className="text-sm text-red-600 mt-1">⚠ {errors.email}</Text>}
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Teléfono (opcional)</Text>
              <TextInput className="bg-white rounded-xl border-2 border-gray-300 p-4 text-base text-[#1A1A2E]" placeholder="+34600000000" placeholderTextColor="#aaa" value={values.phone} onChangeText={handleChange('phone')} onBlur={handleBlur('phone')} keyboardType="phone-pad" />
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Contraseña</Text>
              <TextInput className={`bg-white rounded-xl border-2 p-4 text-base text-[#1A1A2E]${touched.password && errors.password ? ' border-red-600' : ' border-gray-300'}`} placeholder="••••••••" placeholderTextColor="#aaa" value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} secureTextEntry />
              {touched.password && errors.password && <Text className="text-sm text-red-600 mt-1">⚠ {errors.password}</Text>}
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-4">Confirmar contraseña</Text>
              <TextInput className={`bg-white rounded-xl border-2 p-4 text-base text-[#1A1A2E]${touched.confirm_password && errors.confirm_password ? ' border-red-600' : ' border-gray-300'}`} placeholder="••••••••" placeholderTextColor="#aaa" value={values.confirm_password} onChangeText={handleChange('confirm_password')} onBlur={handleBlur('confirm_password')} secureTextEntry />
              {touched.confirm_password && errors.confirm_password && <Text className="text-sm text-red-600 mt-1">⚠ {errors.confirm_password}</Text>}
              <TouchableOpacity className={`bg-[#E85D04] rounded-xl p-[18px] items-center mt-7${isSubmitting ? ' opacity-60' : ''}`} onPress={() => handleSubmit()} disabled={isSubmitting}>
                <Text className="text-white text-base font-bold">{isSubmitting ? 'Registrando...' : 'Crear Cuenta'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600 text-sm">¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={onGoToLogin}>
            <Text className="text-[#E85D04] font-bold text-sm">Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
