# Convenciones de Nombres

## 📝 Archivos y Carpetas
- **Screens**: `ScreenNameScreen.tsx` (PascalCase)
- **Servicios**: `entityService.ts` (camelCase)
- **Componentes**: `ComponentName.tsx` (PascalCase)
- **Hooks**: `useHookName.ts` (camelCase con use)
- **Carpetas**: lowercase
- **Tipos**: `types.ts` o `ScreenParamList`

## 🔤 Código
- **Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Clases**: `PascalCase`
- **Booleanos**: prefijo `is`, `has`, `can` (isActive, hasError)
- **Funciones**: `camelCase` (verbo primero: getData, handlePress)

## 📦 Tipos e Interfaces
- **Interfaces de tipos**: `PascalCase` (UserProfile, Colony, VisitUser)
- **Type unions**: `PascalCase` (CanSize, Status)
- **API Request types**: `EntityCreateRequest`, `EntityUpdateRequest`
- **API Response types**: `ApiResponse<Entity>` genérico
- **Archivos de tipos**: Un archivo por dominio bajo `src/types/`
- **Barrel export**: `src/types/index.ts` con `export type { ... }`

## ❌ VIEJO → ✅ NUEVO
```
ColoniasScreen → ColoniesScreen
DetalleColoniaScreen → ColonyDetailScreen
NuevaVisitaScreen → NewVisitScreen
VisitaDetalleScreen → VisitDetailScreen
ColoniaCreateScreen → ColonyCreateScreen
VisitCreateResponse → Remover (usar ApiResponse<Visit>)
AuthContextType (duplicada) → Importar desde src/types/auth.ts
```
