FROM node:18-alpine as build

WORKDIR /app

ARG ENV_FILE
COPY package*.json ./
COPY ${ENV_FILE} ./.env

RUN npm install --legacy-peer-deps && npm cache clean --force

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# 도커 내부 포트는 80
# 도커 외부 포트는 1507