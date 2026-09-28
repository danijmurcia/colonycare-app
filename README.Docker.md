# Docker - ColonyCare App (Frontend)

## Requisitos
- Docker >= 20.10
- Docker Compose >= 1.29

## Levantar el Frontend

```bash
cd /home/danimurcia/Projects/colonycare-app

# Build (primera vez, tarda 2-5 min)
docker build -t colonycare-app .

# Levantar con docker-compose
docker-compose up
```

## Acceso
- Expo: http://localhost:19000 (web)
- Metro Bundler: http://localhost:8081
- App: Abre en iOS/Android desde Expo app y escanea el QR

## Hot Reload
- Edita archivos en `src/` → cambios en vivo automáticamente
- No necesitas reiniciar el container
- Recarga aparece en ~1-2 segundos

## Parar containers
```bash
docker-compose down
```

## Rebuild (si cambian dependencias)
```bash
docker-compose down
docker build --no-cache -t colonycare-app .
docker-compose up
```

## Troubleshooting

**Build timeout:** aumenta el timeout de Docker Desktop

**Port already in use:** cambia los puertos en docker-compose.yml

**node_modules corrupted:** elimina el volumen
```bash
docker volume rm colonycare-app_node_modules
docker-compose up --build
```