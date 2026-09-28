import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
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

export default function EditColonyScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { colonyId } = route.params || {};
  const [colony, setColony] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadColony();
  }, [colonyId]);

  const loadColony = async () => {
    try {
      const data = await coloniesService.getById(colonyId);
      setColony(data);
    } catch (error) {
      toast.show('Error al cargar colonia', { type: 'danger', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await coloniesService.update(colonyId, { name: values.name, location: values.location, estimated_cats: parseInt(values.estimated_cats) });
      toast.show('Colonia actualizada correctamente', { type: 'success', duration: 2000 });
      setTimeout(() => navigation.goBack(), 500);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al actualizar colonia';
      toast.show(msg, { type: 'danger', duration: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <View style={styles.centerLoader}><ActivityIndicator size="large" color="#E85D04" /></View>;
  if (!colony) return <SafeAreaView style={styles.container}><Text style={styles.errorText}>No se pudo cargar la colonia</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🐱 Editar Colonia</Text>
        </View>
        <Formik initialValues={{ name: colony.name || '', location: colony.location || '', estimated_cats: String(colony.estimated_cats || '') }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput style={[styles.input, touched.name && errors.name && styles.inputError]} placeholder="Ej: Colonia Centro" placeholderTextColor="#999" onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} editable={!submitting} />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Localizacion *</Text>
                <TextInput style={[styles.input, touched.location && errors.location && styles.inputError]} placeholder="Ej: Calle Principal 123" placeholderTextColor="#999" onChangeText={handleChange('location')} onBlur={handleBlur('location')} value={values.location} editable={!submitting} />
                {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Número aproximado de gatos *</Text>
                <TextInput style={[styles.input, touched.estimated_cats && errors.estimated_cats && styles.inputError]} placeholder="Ej: 5" placeholderTextColor="#999" keyboardType="number-pad" onChangeText={handleChange('estimated_cats')} onBlur={handleBlur('estimated_cats')} value={values.estimated_cats} editable={!submitting} />
                {touched.estimated_cats && errors.estimated_cats && <Text style={styles.errorText}>{errors.estimated_cats}</Text>}
              </View>
              <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={() => formikSubmit()} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Guardar cambios</Text>}
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
  form: { marginBottom: 30 },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1A1A2E' },
  inputError: { borderColor: '#D32F2F' },
  errorText: { fontSize: 12, color: '#D32F2F', marginTop: 4 },
  submitBtn: { backgroundColor: '#E85D04', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
