import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useToast } from 'react-native-toast-notifications';
import type { VisitRequest } from '../types';

interface VisitFormScreenProps {
  title: string;
  initialValues?: { cats_seen: number; food_grams: number; wet_food_cans?: number; notes?: string };
  onSubmit: ( VisitRequest) => Promise<void>;
  submitLabel: string;
}

const validationSchema = Yup.object().shape({
  cats_seen: Yup.number().typeError('Debe ser un número').min(0, 'No puede ser negativo').required('El número de gatos es obligatorio'),
  wet_food_cans: Yup.number().typeError('Debe ser un número').min(0, 'Las latas no pueden ser negativas').nullable(),
  notes: Yup.string().max(500, 'Máximo 500 caracteres').nullable(),
});

export default function VisitFormScreen({ title, initialValues, onSubmit, submitLabel }: VisitFormScreenProps) {
  const toast = useToast();
  const [foodGrams, setFoodGrams] = useState<200 | 300 | 500 | 1000 | null>((initialValues?.food_grams as any) || null);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (!foodGrams) {
        toast.show('Selecciona la cantidad de pienso seco', { type: 'danger', duration: 2000 });
        setSubmitting(false);
        return;
      }
      await onSubmit({
        cats_seen: Number(values.cats_seen),
        food_grams: foodGrams,
        wet_food_cans: values.wet_food_cans ? Number(values.wet_food_cans) : undefined,
        notes: values.notes || undefined,
      });
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      throw error;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Gatos vistos *</Text>
        <Formik initialValues={{ cats_seen: String(initialValues?.cats_seen || ''), wet_food_cans: String(initialValues?.wet_food_cans || ''), notes: initialValues?.notes || '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ handleChange, handleSubmit: submit, values, errors, touched, isSubmitting }) => (
            <>
              <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 mb-6 text-base text-[#1A1A2E]${touched.cats_seen && errors.cats_seen ? ' border-red-600' : ''}`} keyboardType="number-pad" value={values.cats_seen} onChangeText={handleChange('cats_seen')} />
              {touched.cats_seen && errors.cats_seen && <Text className="text-sm text-red-500 mt-1 mb-2">{String(errors.cats_seen)}</Text>}
              <Text className="text-base font-semibold text-[#1A1A2E] mb-3">Pienso seco (gramos) *</Text>
              <View className="flex-row gap-3 mb-6">
                {[200, 300, 500, 1000].map(grams => (
                  <TouchableOpacity key={grams} className={`flex-1 rounded-lg border-2 py-2.5 items-center${foodGrams === grams ? ' bg-[#E85D04] border-[#E85D04]' : ' bg-white border-gray-300'}`} onPress={() => setFoodGrams(foodGrams === grams ? null : (grams as any))}>
                    <Text className={`text-base font-semibold${foodGrams === grams ? ' text-white' : ' text-gray-600'}`}>{grams < 1000 ? `${grams}g` : '1kg'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Latas de comida húmeda (opcional)</Text>
              <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 mb-6 text-base text-[#1A1A2E]${touched.wet_food_cans && errors.wet_food_cans ? ' border-red-600' : ''}`} keyboardType="number-pad" value={values.wet_food_cans} onChangeText={handleChange('wet_food_cans')} />
              <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Notas (opcional)</Text>
              <TextInput className="bg-white rounded-lg border border-gray-300 px-4 py-3 mb-6 text-base text-[#1A1A2E]" multiline numberOfLines={4} value={values.notes} onChangeText={handleChange('notes')} />
              <TouchableOpacity className={`bg-[#E85D04] rounded-xl py-4 items-center my-6${isSubmitting ? ' opacity-60' : ''}`} onPress={() => submit()} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text className="text-white text-base font-bold">{submitLabel}</Text>}
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface ViewProps { children?: React.ReactNode; className?: string; }
function View(props: ViewProps) {
  const { View: RNView } = require('react-native');
  return <RNView {...props} />;
}