# Base image
FROM node:20-alpine

RUN mkdir /app_nest

# Set the working directory inside the container
WORKDIR /app_nest

# Copy package.json and package-lock.json
COPY back/package.json /app_nest

# Install dependencies
RUN npm i



