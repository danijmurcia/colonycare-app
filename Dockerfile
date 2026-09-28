FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Exponer puertos
EXPOSE 8081 19000 19001

# Usar entrypoint para login + start
ENTRYPOINT ["sh", "./entrypoint.sh"]