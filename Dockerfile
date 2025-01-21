FROM node:22-alpine as build

WORKDIR /app

COPY ./jamovi/package*.json ./
COPY ./jamovi/.env ./
RUN npm install

COPY ./jamovi/ .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1542

CMD ["nginx", "-g", "daemon off;"]