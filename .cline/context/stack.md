# Tech Stack

## 🛠️ Core
- **Runtime**: React Native 0.86 + Expo SDK 57
- **Lenguaje**: TypeScript 6.0
- **Gestor de paquetes**: npm
- **Node requerido**: v20.20.2+ (probado con v22.22.3)
- **Expo Mode**: `--tunnel` (visión remota desde móvil)

## 📚 Librerías Clave
- **Navegación**: React Navigation 7.x (bottom-tabs, native-stack)
- **HTTP**: Axios 1.20 + interceptores
- **Formularios**: Formik 2.4 + Yup 1.7
- **Almacenamiento**: expo-secure-store 57 (nativo/web)
- **Estilos**: NativeWind 4.2 + StyleSheet
- **Notificaciones**: react-native-toast-notifications 3.4
- **Seguridad**: expo-secure-store (reemplaza AsyncStorage)

## 🚀 Comandos
```bash
# Forma simple
npm start          # Expo local

# Forma recomendada (con tunnel + ngrok + backend)
bash /home/danimurcia/start-colonycare.sh

# Alternativas
npm run android    # Emulador Android
npm run ios        # Simulador iOS
npm run web        # Navegador web
```

## 🌐 Tunnel Mode
- Se levanta con `expo start --tunnel`
- Permite ver desde móvil sin estar en la misma red
- URL pública vía ngrok se inyecta en `src/config/env.ts`
- Script: `/home/danimurcia/start-colonycare.sh`

## 🔧 Archivos de Configuración
- `app.json` - Metadata de la app
- `tsconfig.json` - Config de TypeScript
- `tailwind.config.js` - Config de NativeWind
- `.env` - Variables de entorno
