# Reglas Frontend - React Native

## 📱 Navegación
- Usar React Navigation v7+ con typed stacks
- Bottom tabs: Home, Colonies, Profile
- Deep navigation mediante route params tipados en `types.ts`
- Siempre incluir botón volver (goBack)
- Usar `listeners` en Tab.Screen para resets del stack:
  - **Patrón correcto:** `navigation.navigate()` con screen explícito
  - `tabPress: (e) => { e.preventDefault(); navigation.navigate('tab', { screen: 'list' }); }`
  - NUNCA usar setTimeout + reset() (race conditions)
  - Sincrónico y confiable para stacks anidados

## 🎨 Componentes
- Screens en `src/screens/`
- Usar StyleSheet (performance) + NativeWind (layout)
- Props tipados con interfaces
- Extraer >100 líneas en componente separado

## 🔄 Estado y Hooks
- Global: AuthContext (token, login, logout)
- Local: useState para estado del componente
- Effects: useEffect, useFocusEffect con deps explícitas
- Custom hooks en `src/hooks/`

## 📡 Llamadas API
- Usar servicios en `src/services/`
- HttpManager con Axios + interceptores
- 401 → auto logout via interceptor
- Error handling con toast notifications
