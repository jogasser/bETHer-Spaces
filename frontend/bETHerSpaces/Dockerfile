FROM node:16.15.0-alpine AS node_build

WORKDIR /workspace/build

COPY . .

RUN npm ci
RUN npm install -g expo-cli
ARG EXPO_ENV
RUN expo build:web

FROM nginx:latest

COPY --from=node_build  /workspace/build/web-build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
