FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build \
  && echo "Contents of dist:" \
  && ls -al dist  # <--- See what’s inside the dist folder

CMD ["npm", "run", "start"]
