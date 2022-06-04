FROM node:16

WORKDIR /app
RUN apt-get remove docker docker-engine docker.io containerd runc
COPY . /app
ARG ARG_MONGO_DB
ARG ARG_AMQP_URL
ARG ARG_REDIS_URL
ARG ARG_REDIS_PORT
ARG ARG_REDIS_USER
ARG ARG_REDIS_PASSWORD
COPY ./env-script.sh ./
RUN ./env-script.sh
RUN npm ci
EXPOSE 8000
CMD [ "node", "index.js" ]