FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM httpd:alpine
COPY --from=build /app/dist/ITunesConsulta/browser /usr/local/apache2/htdocs/

EXPOSE 80

