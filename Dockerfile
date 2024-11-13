# Usamos una imagen de Node.js para construir el proyecto Angular
FROM node:18 AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Instalamos las dependencias y compilamos la aplicación Angular
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Usamos una imagen de servidor Apache para servir los archivos estáticos
FROM httpd:alpine
COPY --from=build /app/dist/ITunesConsulta/browser /usr/local/apache2/htdocs/

# Exponemos el puerto donde se servirá la aplicación Angular
EXPOSE 80

