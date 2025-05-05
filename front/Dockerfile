# frontend/Dockerfile
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --mode droplet

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Replace default Nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf