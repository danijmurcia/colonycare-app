FROM node:20-alpine

WORKDIR /app

# Instalar expo-cli globalmente
RUN npm install -g expo-cli

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Exponer puertos (Expo)
EXPOSE 8081 19000 19001

# Comando por defecto
CMD ["expo", "start", "--tunnel"]