import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
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

  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#E85D04" /></View>;
  if (!colony) return <SafeAreaView className="flex-1 bg-slate-50"><Text className="text-sm text-red-500">No se pudo cargar la colonia</Text></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 px-4">
        <View className="my-6">
          <Text className="text-3xl font-black text-[#1A1A2E]">🐱 Editar Colonia</Text>
        </View>
        <Formik initialValues={{ name: colony.name || '', location: colony.location || '', estimated_cats: String(colony.estimated_cats || '') }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched }) => (
            <View className="mb-8">
              <View className="mb-6">
                <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Nombre *</Text>
                <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 text-base text-[#1A1A2E]${touched.name && errors.name ? ' border-red-500' : ''}`} placeholder="Ej: Colonia Centro" placeholderTextColor="#999" onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} editable={!submitting} />
                {touched.name && errors.name && <Text className="text-sm text-red-500 mt-1">{errors.name}</Text>}
              </View>
              <View className="mb-6">
                <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Ubicación *</Text>
                <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 text-base text-[#1A1A2E]${touched.location && errors.location ? ' border-red-500' : ''}`} placeholder="Ej: Calle Principal 123" placeholderTextColor="#999" onChangeText={handleChange('location')} onBlur={handleBlur('location')} value={values.location} editable={!submitting} />
                {touched.location && errors.location && <Text className="text-sm text-red-500 mt-1">{errors.location}</Text>}
              </View>
              <View className="mb-6">
                <Text className="text-base font-semibold text-[#1A1A2E] mb-2">Número aproximado de gatos *</Text>
                <TextInput className={`bg-white rounded-lg border border-gray-300 px-4 py-3 text-base text-[#1A1A2E]${touched.estimated_cats && errors.estimated_cats ? ' border-red-500' : ''}`} placeholder="Ej: 5" placeholderTextColor="#999" keyboardType="number-pad" onChangeText={handleChange('estimated_cats')} onBlur={handleBlur('estimated_cats')} value={values.estimated_cats} editable={!submitting} />
                {touched.estimated_cats && errors.estimated_cats && <Text className="text-sm text-red-500 mt-1">{errors.estimated_cats}</Text>}
              </View>
              <TouchableOpacity className={`bg-[#E85D04] rounded-lg py-4 items-center${submitting ? ' opacity-60' : ''}`} onPress={() => formikSubmit()} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#FFF" /> : <Text className="text-white text-base font-semibold">Guardar cambios</Text>}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}
