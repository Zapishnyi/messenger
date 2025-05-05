FROM node:20-alpine as back_build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

