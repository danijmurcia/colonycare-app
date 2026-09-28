# Reglas Frontend - React Native

## 📱 Navegación
- Usar React Navigation v7+ con typed stacks
- Bottom tabs: Home, Colonies, Profile
- Deep navigation mediante route params tipados en `types.ts`
- Siempre incluir botón volver (goBack)
- Usar `listeners` en Tab.Screen para resets del stack:
  - **Patrón:** `setTimeout(() => reset(), 100)` en tabPress listener
  - Permite que la navegación ocurra primero, luego resetea el stack
  - Necesario para stacks anidados dentro de tabs

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
