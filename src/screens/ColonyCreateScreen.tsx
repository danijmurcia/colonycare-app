import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useToast } from 'react-native-toast-notifications';
import { ColoniesStackParamList } from '../navigation/types';
import { coloniesService } from '../services/coloniesService';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  location: Yup.string().required('La ubicación es requerida').min(3, 'Mínimo 3 caracteres'),
  estimated_cats: Yup.number().required('Número de gatos es requerido').min(1, 'Mínimo 1 gato').integer('Debe ser un número entero'),
});

export default function ColonyCreateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList, 'colony-create'>>();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await coloniesService.create(values);
      toast.show('Colonia creada correctamente', { type: 'success', duration: 2000 });
      setTimeout(() => navigation.goBack(), 500);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al crear colonia';
      toast.show(msg, { type: 'danger', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🐱 Nueva Colonia</Text>
          <Text style={styles.subtitle}>Registra una nueva colonia de gatos</Text>
        </View>
        <Formik
          initialValues={{ name: '', location: '', estimated_cats: '' }}
          validationSchema={validationSchema}
          onSubmit={(v) => handleSubmit({ name: v.name, location: v.location, estimated_cats: parseInt(v.estimated_cats) })}
        >
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput style={[styles.input, touched.name && errors.name && styles.inputError]} placeholder="Ej: Colonia Centro" placeholderTextColor="#999" onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} editable={!loading} />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Ubicación *</Text>
                <TextInput style={[styles.input, touched.location && errors.location && styles.inputError]} placeholder="Ej: Calle Principal 123" placeholderTextColor="#999" onChangeText={handleChange('location')} onBlur={handleBlur('location')} value={values.location} editable={!loading} />
                {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Número aproximado de gatos *</Text>
                <TextInput style={[styles.input, touched.estimated_cats && errors.estimated_cats && styles.inputError]} placeholder="Ej: 5" placeholderTextColor="#999" keyboardType="number-pad" onChangeText={handleChange('estimated_cats')} onBlur={handleBlur('estimated_cats')} value={values.estimated_cats} editable={!loading} />
                {touched.estimated_cats && errors.estimated_cats && <Text style={styles.errorText}>{errors.estimated_cats}</Text>}
              </View>
              <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={() => formikSubmit()} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Crear colonia</Text>}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topHeader: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { fontSize: 16, color: '#E85D04', fontWeight: '700' },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  header: { marginVertical: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
  subtitle: { fontSize: 13, color: '#999', marginTop: 4 },
  form: { marginBottom: 30 },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1A1A2E' },
  inputError: { borderColor: '#D32F2F' },
  errorText: { fontSize: 12, color: '#D32F2F', marginTop: 4 },
  submitBtn: { backgroundColor: '#E85D04', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
