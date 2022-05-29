FROM node:16
ENV NODE_ENV=production
WORKDIR /app
COPY . /app
RUN npm install --production
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]