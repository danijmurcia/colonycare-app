FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Exponer puertos
EXPOSE 8081 19000 19001

# Comando: usar npm start con --tunnel
CMD ["npm", "start", "--", "--tunnel"]