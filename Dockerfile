FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm ci
EXPOSE 8000
CMD [ "node", "index.js" ]