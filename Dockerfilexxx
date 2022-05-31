FROM node:16

WORKDIR /var/source

COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]