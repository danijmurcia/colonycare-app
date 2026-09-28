import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { coloniesService } from '../services/coloniesService';

const validationSchema = Yup.object().shape({
  cats_seen: Yup.number().typeError('Debe ser un número').min(0).required('Requerido'),
  food_grams: Yup.number().typeError('Debe ser un número').min(0).required('Requerido'),
  wet_food_cans: Yup.number().typeError('Debe ser un número').min(0).nullable(),
  notes: Yup.string().max(500),
});

export default function NuevaVisitaScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation();
  const toast = useToast();
  const { colonyId } = route.params || {};
  const [canSize, setCanSize] = useState<'small' | 'large' | null>(null);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await coloniesService.createVisit(colonyId, {
        cats_seen: Number(values.cats_seen),
        food_grams: Number(values.food_grams),
        wet_food_cans: values.wet_food_cans ? Number(values.wet_food_cans) : undefined,
        can_size: canSize || undefined,
        notes: values.notes || undefined,
      });
      toast.show(response.message || 'Visita registrada correctamente', {
        type: 'success',
        duration: 2000,
      });
      navigation.goBack();
    } catch (error: any) {
      toast.show(error.response?.data?.message || 'Error al registrar la visita', {
        type: 'danger',
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Visita</Text>
        <View />
      </View>
      <Formik
        initialValues={{ cats_seen: '', food_grams: '', wet_food_cans: '', notes: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit: submit, values, errors, touched, isSubmitting }) => (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">

              <Text style={styles.label}>🐱 Gatos vistos *</Text>
              <TextInput style={[styles.input, touched.cats_seen && errors.cats_seen ? styles.inputError : null]} placeholder="0" keyboardType="number-pad" value={values.cats_seen} onChangeText={handleChange('cats_seen')} />
              {touched.cats_seen && errors.cats_seen && <Text style={styles.error}>{String(errors.cats_seen)}</Text>}

              <Text style={styles.label}>🍽️ Comida seca (gramos) *</Text>
              <TextInput style={[styles.input, touched.food_grams && errors.food_grams ? styles.inputError : null]} placeholder="0" keyboardType="number-pad" value={values.food_grams} onChangeText={handleChange('food_grams')} />
              {touched.food_grams && errors.food_grams && <Text style={styles.error}>{String(errors.food_grams)}</Text>}

              <Text style={styles.label}>🥫 Latas de comida húmeda (opcional)</Text>
              <TextInput style={styles.input} placeholder="0" keyboardType="number-pad" value={values.wet_food_cans} onChangeText={handleChange('wet_food_cans')} />

              <Text style={styles.label}>📦 Tamaño de lata (opcional)</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity style={[styles.toggleBtn, canSize === 'small' && styles.toggleActive]} onPress={() => setCanSize(canSize === 'small' ? null : 'small')}>
                  <Text style={[styles.toggleText, canSize === 'small' && styles.toggleTextActive]}>Pequeña</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleBtn, canSize === 'large' && styles.toggleActive]} onPress={() => setCanSize(canSize === 'large' ? null : 'large')}>
                  <Text style={[styles.toggleText, canSize === 'large' && styles.toggleTextActive]}>Grande</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>📝 Notas (opcional)</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Observaciones, estado de gatos, incidencias..." multiline numberOfLines={4} value={values.notes} onChangeText={handleChange('notes')} />

              <TouchableOpacity style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} onPress={() => submit()} disabled={isSubmitting}>
                <Text style={styles.submitBtnText}>{isSubmitting ? 'Guardando...' : '✓ Guardar Visita'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { fontSize: 16, color: '#E85D04', fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  content: { flex: 1, paddingHorizontal: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 8, marginTop: 4 },
  input: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, fontSize: 14 },
  inputError: { borderColor: '#D32F2F' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
  error: { color: '#D32F2F', fontSize: 12, marginBottom: 8 },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  toggleBtn: { flex: 1, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', paddingVertical: 10, alignItems: 'center', backgroundColor: '#FFF' },
  toggleActive: { backgroundColor: '#E85D04', borderColor: '#E85D04' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#666' },
  toggleTextActive: { color: '#FFF' },
  submitBtn: { backgroundColor: '#E85D04', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginVertical: 24 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
