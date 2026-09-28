import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { coloniesService } from '../services/coloniesService';

const validationSchema = Yup.object().shape({
  cats_seen: Yup.number()
    .typeError('Debe ser un número')
    .min(0, 'No puede ser negativo')
    .required('El número de gatos es obligatorio'),
  food_grams: Yup.string().nullable(),
  wet_food_cans: Yup.number()
    .typeError('Debe ser un número')
    .min(0, 'No puede ser negativo')
    .nullable()
    .transform((val, orig) => orig === '' ? null : val),
  notes: Yup.string().max(500, 'Máximo 500 caracteres'),
});

export default function NewVisitScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation();
  const toast = useToast();
  const { colonyId } = route.params || {};
  const [foodGrams, setFoodGrams] = useState<200 | 300 | 500 | 1000 | null>(null);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (!foodGrams) {
        toast.show('Selecciona la cantidad de pienso seco', { type: 'danger', duration: 2000 });
        setSubmitting(false);
        return;
      }
      const response = await coloniesService.createVisit(colonyId, {
        cats_seen: Number(values.cats_seen),
        food_grams: foodGrams,
        wet_food_cans: values.wet_food_cans ? Number(values.wet_food_cans) : undefined,
        
        notes: values.notes || undefined,
      });
      toast.show(response.message || 'Visita registrada correctamente', { type: 'success', duration: 2000 });
      navigation.goBack();
    } catch (error: any) {
      toast.show(error.response?.data?.message || 'Error al registrar la visita', { type: 'danger', duration: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nueva visita</Text>
        <View />
      </View>
      <Formik initialValues={{ cats_seen: '', food_grams: '', wet_food_cans: '', notes: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ handleChange, handleSubmit: submit, values, errors, touched, isSubmitting }) => (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Gatos vistos *</Text>
              <TextInput
                style={[styles.input, touched.cats_seen && errors.cats_seen ? styles.inputError : null]}
                placeholder="0"
                keyboardType="number-pad"
                value={values.cats_seen}
                onChangeText={handleChange('cats_seen')}
              />
              {touched.cats_seen && errors.cats_seen && <Text style={styles.error}>{String(errors.cats_seen)}</Text>}
              <Text style={styles.label}>Pienso seco (gramos) *</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity style={[styles.toggleBtn, foodGrams === 200 && styles.toggleActive]} onPress={() => setFoodGrams(foodGrams === 200 ? null : 200)}>
                  <Text style={[styles.toggleText, foodGrams === 200 && styles.toggleTextActive]}>200g</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleBtn, foodGrams === 300 && styles.toggleActive]} onPress={() => setFoodGrams(foodGrams === 300 ? null : 300)}>
                  <Text style={[styles.toggleText, foodGrams === 300 && styles.toggleTextActive]}>300g</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleBtn, foodGrams === 500 && styles.toggleActive]} onPress={() => setFoodGrams(foodGrams === 500 ? null : 500)}>
                  <Text style={[styles.toggleText, foodGrams === 500 && styles.toggleTextActive]}>500g</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleBtn, foodGrams === 1000 && styles.toggleActive]} onPress={() => setFoodGrams(foodGrams === 1000 ? null : 1000)}>
                  <Text style={[styles.toggleText, foodGrams === 1000 && styles.toggleTextActive]}>1kg</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.label}>Latas de comida húmeda (opcional)</Text>
              <TextInput
                style={[styles.input, touched.wet_food_cans && errors.wet_food_cans ? styles.inputError : null]}
                placeholder="0"
                keyboardType="number-pad"
                value={values.wet_food_cans}
                onChangeText={handleChange('wet_food_cans')}
              />
              {touched.wet_food_cans && errors.wet_food_cans && <Text style={styles.error}>{String(errors.wet_food_cans)}</Text>}
              {touched.notes && errors.notes && <Text style={styles.error}>{String(errors.notes)}</Text>}
              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={() => submit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Guardar visita</Text>}
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
