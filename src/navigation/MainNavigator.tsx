import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ColoniesScreen from '../screens/ColoniesScreen';
import ColonyDetailScreen from '../screens/ColonyDetailScreen';
import EditColonyScreen from '../screens/EditColonyScreen';
import VisitDetailScreen from '../screens/VisitDetailScreen';
import ColonyCreateScreen from '../screens/ColonyCreateScreen';
import NewVisitScreen from '../screens/NewVisitScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TabParamList, ColoniesStackParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const ColoniesStack = createNativeStackNavigator<ColoniesStackParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>;
}

function ColoniesStackNavigator() {
  return (
    <ColoniesStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="colonies-list"
    >
      <ColoniesStack.Group>
        <ColoniesStack.Screen name="colonies-list" component={ColoniesScreen} />
        <ColoniesStack.Screen name="colony-detail" component={ColonyDetailScreen} />
        <ColoniesStack.Screen name="colony-edit" component={EditColonyScreen} />
        <ColoniesStack.Screen name="colony-create" component={ColonyCreateScreen} />
        <ColoniesStack.Screen name="visit-new" component={NewVisitScreen} />
        <ColoniesStack.Screen name="visit-detail" component={VisitDetailScreen} />
      </ColoniesStack.Group>
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('colonies', {
              screen: 'colonies-list',
            });
          },
        })}
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
