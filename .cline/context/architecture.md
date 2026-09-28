# Decisiones de Arquitectura

## 🏛️ Patrón: Arquitectura por Capas

```
UI Layer (Screens)
   ↓
Business Logic (Services)
   ↓
Data Access (API via HttpManager)
   ↓
State (AuthContext)
```

## 📦 Organización de Módulos
- **Screens**: Solo presentación de UI
- **Services**: Llamadas API + transformación de datos
- **Context**: Estado global (Auth)
- **Navigation**: Lógica de routing de la app
- **Types**: Definiciones de tipos centralizadas

## 🔄 Flujo de Datos
1. Screen llama método del servicio
2. Servicio hace llamada HTTP via HttpManager
3. HttpManager maneja interceptores (401, etc)
4. Response serializado via schemas (type-safe)
5. Estado actualizado via Context/useState
6. UI re-renderiza

## ⚙️ Operaciones Async
- Todo async en servicios (no en screens)
- Screens usan loading/error states
- Errores → toast notifications
- Loading → ActivityIndicator
