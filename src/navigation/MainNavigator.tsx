import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ColoniasScreen from '../screens/ColoniasScreen';
import DetalleColoniaScreen from '../screens/DetalleColoniaScreen';
import VisitaDetalleScreen from '../screens/VisitaDetalleScreen';
import ColoniaCreateScreen from '../screens/ColoniaCreateScreen';
import NuevaVisitaScreen from '../screens/NuevaVisitaScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TabParamList, ColoniesStackParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const ColoniesStack = createNativeStackNavigator<ColoniesStackParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>;
}

function ColoniesStackNavigator() {
  return (
    <ColoniesStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="colonies-list">
      <ColoniesStack.Screen name="colonies-list" component={ColoniasScreen} />
      <ColoniesStack.Screen name="colony-detail" component={DetalleColoniaScreen} />
      <ColoniesStack.Screen name="colony-create" component={ColoniaCreateScreen} />
      <ColoniesStack.Screen name="visit-new" component={NuevaVisitaScreen} />
      <ColoniesStack.Screen name="visit-detail" component={VisitaDetalleScreen} />
    </ColoniesStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F0F0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#E85D04',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="colonies"
        component={ColoniesStackNavigator}
        options={{
          tabBarLabel: 'Colonias',
          tabBarIcon: ({ focused }) => <TabIcon icon="🐱" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
