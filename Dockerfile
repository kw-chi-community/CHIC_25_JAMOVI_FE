FROM node:18.17.1-alpine AS deps

WORKDIR /app

ARG ENV_FILE

COPY package*.json ./

COPY ${ENV_FILE} ./.env

RUN npm ci

FROM node:18.17.1-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# 도커 내부 포트는 80
# 도커 외부 포트는 1507