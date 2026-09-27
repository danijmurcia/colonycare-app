import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>🐱</Text>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a ColonyCare</Text>
        </View>

        <Formik
          initialValues={{ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '' }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View>
              <Text style={styles.label}>Nombre</Text>
              <TextInput style={[styles.input, touched.first_name && errors.first_name && styles.inputError]} placeholder="Introduce tu nombre" placeholderTextColor="#aaa" value={values.first_name} onChangeText={handleChange('first_name')} onBlur={handleBlur('first_name')} />
              {touched.first_name && errors.first_name && <Text style={styles.error}>⚠ {errors.first_name}</Text>}

              <Text style={styles.label}>Apellido</Text>
              <TextInput style={[styles.input, touched.last_name && errors.last_name && styles.inputError]} placeholder="Introduce tus apellidos" placeholderTextColor="#aaa" value={values.last_name} onChangeText={handleChange('last_name')} onBlur={handleBlur('last_name')} />
              {touched.last_name && errors.last_name && <Text style={styles.error}>⚠ {errors.last_name}</Text>}

              <Text style={styles.label}>Email</Text>
              <TextInput style={[styles.input, touched.email && errors.email && styles.inputError]} placeholder="Introduce tu email (your@mail.com)" placeholderTextColor="#aaa" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} keyboardType="email-address" autoCapitalize="none" />
              {touched.email && errors.email && <Text style={styles.error}>⚠ {errors.email}</Text>}

              <Text style={styles.label}>Teléfono (opcional)</Text>
              <TextInput style={styles.input} placeholder="+34600000000" placeholderTextColor="#aaa" value={values.phone} onChangeText={handleChange('phone')} onBlur={handleBlur('phone')} keyboardType="phone-pad" />

              <Text style={styles.label}>Contraseña</Text>
              <TextInput style={[styles.input, touched.password && errors.password && styles.inputError]} placeholder="••••••••" placeholderTextColor="#aaa" value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} secureTextEntry />
              {touched.password && errors.password && <Text style={styles.error}>⚠ {errors.password}</Text>}

              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput style={[styles.input, touched.confirm_password && errors.confirm_password && styles.inputError]} placeholder="••••••••" placeholderTextColor="#aaa" value={values.confirm_password} onChangeText={handleChange('confirm_password')} onBlur={handleBlur('confirm_password')} secureTextEntry />
              {touched.confirm_password && errors.confirm_password && <Text style={styles.error}>⚠ {errors.confirm_password}</Text>}

              <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={() => handleSubmit()} disabled={isSubmitting}>
                <Text style={styles.buttonText}>{isSubmitting ? 'Registrando...' : 'Crear Cuenta'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={onGoToLogin}>
            <Text style={styles.link}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F8F9FA' },
  scroll:         { paddingHorizontal: 24, paddingVertical: 40 },
  header:         { alignItems: 'center', marginBottom: 32 },
  emoji:          { fontSize: 56, marginBottom: 12 },
  title:          { fontSize: 32, fontWeight: '900', color: '#1A1A2E', fontStyle: 'italic', marginBottom: 4 },
  subtitle:       { fontSize: 15, color: '#666666' },
  label:          { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 8, marginTop: 16 },
  input:          { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1.5, borderColor: '#E0E0E0', fontSize: 16, color: '#1A1A2E' },
  inputError:     { borderColor: '#D32F2F' },
  error:          { fontSize: 13, color: '#D32F2F', marginTop: 4 },
  button:         { backgroundColor: '#E85D04', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 28 },
  buttonDisabled: { opacity: 0.6 },
  buttonText:     { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  footer:         { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText:     { color: '#666666', fontSize: 14 },
  link:           { color: '#E85D04', fontWeight: '700', fontSize: 14 },
});
