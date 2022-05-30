FROM node:16
ENV NODE_ENV=production
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install
COPY . /app
EXPOSE 8080
CMD [ "node", "index.js" ]