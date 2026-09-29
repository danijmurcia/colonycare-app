# Type Safety & API Integration Rules

## 📦 Type Organization

### Directory Structure
```
src/types/
├── index.ts          (barrel export)
├── api.ts           (generic ApiResponse<T>)
├── auth.ts          (User, Auth types)
├── colony.ts        (Colony types)
├── visit.ts         (Visit types)
└── navigation.ts    (Navigation stack types)
```

### Barrel Export Pattern
- Single entry point: `import type { Colony, Visit } from '../types'`
- Export only types needed by consumers
- Use `export type` (not `export`) for tree-shaking

## 🔗 API Integration

### Reflect Backend Schemas
- TypeScript types MUST match API schema definitions
- Verify against `colonycare-api` schemas.py files
- Never diverge from API structure without documenting reason

**Example Mapping:**
```ts
// colonycare-api/users/schemas.py → UserRead
// colonycare-app/src/types/auth.ts → UserProfile (same structure)
interface UserProfile {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  first_name?: string;  // Optional matches API Optional[str]
  last_name?: string;
  phone?: string;
}
```

### Generic ApiResponse Pattern
```ts
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
   T;  // Generic data type
}

// Usage in services
const response = await httpManager.get<ApiResponse<Colony[]>>();
```

## 🎯 Type Creation Best Practices

### Avoid Duplication with Omit/Partial
```ts
// ✅ Good: Single source of truth
export interface Colony { id, name, location, estimated_cats }
export type ColonyCreateRequest = Omit<Colony, 'id'>;
export type ColonyUpdateRequest = Partial<ColonyCreateRequest>;

// ❌ Bad: Duplicate definitions
export interface ColonyCreate { name, location, estimated_cats }  // Redundant!
```

### Don't Duplicate Types Between Modules
```ts
// ❌ Bad: AuthContextType defined in both places
// src/types/auth.ts
interface AuthContextType { ... }
// src/context/AuthContext.tsx  (duplicated!)
interface AuthContextType { ... }

// ✅ Good: Import single definition
import type { AuthContextType } from '../types/auth';
```

### Remove Unnecessary Wrappers
```ts
// ❌ Bad: Wrapper type
export interface VisitCreateResponse {
  message?: string;
   Visit;
}

// ✅ Good: Use ApiResponse<Visit> directly
export type VisitResponse = ApiResponse<Visit>;
// Or return Promise<Visit> from service
```

## 🔤 Naming Conventions for Types

- **Interfaces**: `PascalCase` (UserProfile, Colony, VisitUser)
- **Type unions**: `PascalCase` (CanSize = 'small' | 'large')
- **Request types**: `EntityCreateRequest`, `EntityUpdateRequest`
- **Optional fields**: `?` suffix in interface, `Optional[T]` in API

## ✅ Checklist Before Commit

- [ ] No type duplications between files
- [ ] All types match API schemas exactly
- [ ] Barrel export includes all exported types
- [ ] No unused type exports
- [ ] Generic types used for common patterns (ApiResponse<T>)
- [ ] Omit/Partial used to avoid redundancy
