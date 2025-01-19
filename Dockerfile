FROM node:22-alpine as build

WORKDIR /app

COPY ./jamovi/package*.json ./
RUN npm install

COPY ./jamovi/ .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# 도커 내부 포트는 80
# 도커 외부 포트는 1507