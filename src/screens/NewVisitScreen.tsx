import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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
  const [canSize, setCanSize] = useState<'small' | 'large' | null>(null);
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
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-lg font-black text-[#1A1A2E]">Nueva visita</Text>
        <View />
      </View>
      <Formik initialValues={{ cats_seen: '', food_grams: '', wet_food_cans: '', notes: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ handleChange, handleSubmit: submit, values, errors, touched, isSubmitting }) => (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-1">Gatos vistos *</Text>
              <TextInput className={`bg-white rounded-lg border-2 px-3 py-3 mb-2 text-base text-[#1A1A2E]${touched.cats_seen && errors.cats_seen ? ' border-red-600' : ' border-gray-300'}`} placeholder="0" keyboardType="number-pad" value={values.cats_seen} onChangeText={handleChange('cats_seen')} />
              {touched.cats_seen && errors.cats_seen && <Text className="text-red-600 text-sm mb-2">{String(errors.cats_seen)}</Text>}
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-1">Pienso seco (gramos) *</Text>
              <View className="flex-row gap-3 mb-4">
                <TouchableOpacity className={`flex-1 rounded-lg border-2 py-2.5 items-center${foodGrams === 200 ? ' bg-[#E85D04] border-[#E85D04]' : ' bg-white border-gray-300'}`} onPress={() => setFoodGrams(foodGrams === 200 ? null : 200)}>
                  <Text className={`text-base font-semibold${foodGrams === 200 ? ' text-white' : ' text-gray-600'}`}>200g</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-1 rounded-lg border-2 py-2.5 items-center${foodGrams === 300 ? ' bg-[#E85D04] border-[#E85D04]' : ' bg-white border-gray-300'}`} onPress={() => setFoodGrams(foodGrams === 300 ? null : 300)}>
                  <Text className={`text-base font-semibold${foodGrams === 300 ? ' text-white' : ' text-gray-600'}`}>300g</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-1 rounded-lg border-2 py-2.5 items-center${foodGrams === 500 ? ' bg-[#E85D04] border-[#E85D04]' : ' bg-white border-gray-300'}`} onPress={() => setFoodGrams(foodGrams === 500 ? null : 500)}>
                  <Text className={`text-base font-semibold${foodGrams === 500 ? ' text-white' : ' text-gray-600'}`}>500g</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-1 rounded-lg border-2 py-2.5 items-center${foodGrams === 1000 ? ' bg-[#E85D04] border-[#E85D04]' : ' bg-white border-gray-300'}`} onPress={() => setFoodGrams(foodGrams === 1000 ? null : 1000)}>
                  <Text className={`text-base font-semibold${foodGrams === 1000 ? ' text-white' : ' text-gray-600'}`}>1kg</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-1">Latas (opt)</Text>
              <TextInput className={`bg-white rounded-lg border-2 px-3 py-3 mb-2 text-base text-[#1A1A2E]${touched.wet_food_cans && errors.wet_food_cans ? ' border-red-600' : ' border-gray-300'}`} placeholder="0" keyboardType="number-pad" value={values.wet_food_cans} onChangeText={handleChange('wet_food_cans')} />
              {touched.wet_food_cans && errors.wet_food_cans && <Text className="text-red-600 text-sm mb-2">{String(errors.wet_food_cans)}</Text>}
              <Text className="text-base font-bold text-[#1A1A2E] mb-2 mt-1">Notas (opt)</Text>
              <TextInput className="bg-white rounded-lg border-2 border-gray-300 px-3 py-3 mb-2 text-base text-[#1A1A2E] h-24" placeholder="Observaciones..." multiline numberOfLines={4} value={values.notes} onChangeText={handleChange('notes')} />
              {touched.notes && errors.notes && <Text className="text-red-600 text-sm mb-2">{String(errors.notes)}</Text>}
              <TouchableOpacity className={`bg-[#E85D04] rounded-xl py-4 items-center my-6${isSubmitting ? ' opacity-60' : ''}`} onPress={() => submit()} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text className="text-white text-base font-bold">Guardar visita</Text>}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
}
