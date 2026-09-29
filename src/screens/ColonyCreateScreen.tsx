import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useToast } from 'react-native-toast-notifications';
import { ColoniesStackParamList } from '../navigation/types';
import { coloniesService } from '../services/coloniesService';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(5, 'Mínimo 5 caracteres')
    .test('no-only-spaces', 'El nombre no puede ser solo espacios', (value) => !value || value.trim().length > 0),
  location: Yup.string()
    .required('La ubicación es requerida')
    .min(5, 'Mínimo 5 caracteres')
    .test('no-only-spaces', 'La ubicación no puede ser solo espacios', (value) => !value || value.trim().length > 0),
  estimated_cats: Yup.number()
    .required('Número de gatos es requerido')
    .min(1, 'Debe ser mayor a 0')
    .integer('Debe ser un número entero'),
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
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 px-4">
        <View className="my-6">
          <Text className="text-3xl font-black text-[#1A1A2E]">🐱 Nueva Colonia</Text>
          <Text className="text-base text-gray-400 mt-1">Registra una nueva colonia de gatos</Text>
        </View>
        <Formik
          initialValues={{ name: '', location: '', estimated_cats: '' }}
          validationSchema={validationSchema}
          onSubmit={(v) => handleSubmit({ name: v.name, location: v.location, estimated_cats: parseInt(v.estimated_cats) })}
        >
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched }) => (
            <View className="mb-8">
              <View className="mb-6">
                <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Nombre *</Text>
                <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 text-base text-[#1A1A2E]${touched.name && errors.name ? ' border-red-500' : ''}`} placeholder="Ej: Colonia Centro" placeholderTextColor="#999" onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} editable={!loading} />
                {touched.name && errors.name && <Text className="text-sm text-red-500 mt-1">{errors.name}</Text>}
              </View>
              <View className="mb-6">
                <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Ubicación *</Text>
                <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 text-base text-[#1A1A2E]${touched.location && errors.location ? ' border-red-500' : ''}`} placeholder="Ej: Calle Principal 123" placeholderTextColor="#999" onChangeText={handleChange('location')} onBlur={handleBlur('location')} value={values.location} editable={!loading} />
                {touched.location && errors.location && <Text className="text-sm text-red-500 mt-1">{errors.location}</Text>}
              </View>
              <View className="mb-6">
                <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Número aproximado de gatos *</Text>
                <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 text-base text-[#1A1A2E]${touched.estimated_cats && errors.estimated_cats ? ' border-red-500' : ''}`} placeholder="Ej: 5" placeholderTextColor="#999" keyboardType="number-pad" onChangeText={handleChange('estimated_cats')} onBlur={handleBlur('estimated_cats')} value={values.estimated_cats} editable={!loading} />
                {touched.estimated_cats && errors.estimated_cats && <Text className="text-sm text-red-500 mt-1">{errors.estimated_cats}</Text>}
              </View>
              <TouchableOpacity className={`bg-[#E85D04] rounded-lg py-4 items-center${loading ? ' opacity-60' : ''}`} onPress={() => formikSubmit()} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text className="text-white text-base font-semibold">Crear colonia</Text>}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}
