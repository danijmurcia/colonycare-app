# Reglas Cline para ColonyCare App

Cline lee automáticamente estas reglas desde la carpeta `.cline/`.

## 📂 Cómo Cline usa estas reglas:

1. **Al iniciar**: Cline lee todos los archivos `.md` en esta carpeta
2. **Auto-aplicar**: Reglas en `rules/general.md` aplican a todas las tareas
3. **Context-aware**: Reglas en `rules/frontend.md` aplican al trabajo frontend
4. **Arquitectura**: Revisar `context/architecture.md` para decisiones

## 🎯 Estructura de Reglas

- `rules/general.md` → Reglas universales (Inglés, estilo de código)
- `rules/frontend.md` → Reglas específicas de React Native
- `rules/naming.md` → Todas las convenciones de nombres
- `context/architecture.md` → Decisiones de diseño
- `context/stack.md` → Tech stack & versiones

## 🚀 Uso

Al trabajar en ColonyCare App:

```
Cline lee automáticamente:
1. .cline/rules/general.md
2. .cline/rules/frontend.md
3. .cline/rules/naming.md
4. .cline/context/architecture.md
5. .cline/context/stack.md
```

No se necesita setup adicional. Las reglas se aplican por tarea.
