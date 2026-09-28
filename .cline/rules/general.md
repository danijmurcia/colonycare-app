# Reglas Generales - ColonyCare App

## 🌐 Lenguaje y Estilo
- **TODO el código en INGLÉS** (sin español en variables, comentarios, strings)
- **TypeScript** para type safety
- Usar `.tsx` para componentes React, `.ts` para utilidades
- No usar `any` a menos que sea absolutamente necesario

## 📋 Commits en INGLÉS

Formar: `type(scope): message`

```
feat(navigation): fix colony tab reset on focus
fix(screens): update colony data when ID changes
refactor(services): extract HTTP logic
chore(deps): upgrade expo to v57
docs(auth): add JWT flow diagram
```

## 🏛️ Principios SOLID
- **S**ingle Responsibility: Un componente = una responsabilidad
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov Substitution: Componentes intercambiables
- **I**nterface Segregation: Interfaces específicas, no genéricas
- **D**ependency Inversion: Inyectar dependencias (props), no hardcodear

## 🔍 Organización de Archivos
- Un componente por archivo
- Export default cuando hay una sola exportación
- Imports ordenados: React → RN → Navigation → Custom

## ✅ Antes de hacer Commit
- [ ] Sin console.log() sobrantes
- [ ] Types completos (sin `any`)
- [ ] Solo inglés en código (incluye commit message)
- [ ] Sin imports no usados
