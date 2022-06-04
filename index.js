const Koa = require("koa");
const mongoose = require("mongoose");
const app = new Koa();
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const http = require("http");
const api = require("./src/routes/index");
const cluster = require("cluster");
// const control = require("strong-cluster-control");
const numCPUs = require("os").cpus().length;
// const os = require('os').cpus()
require("dotenv/config");
// const messaging = require('./src/amqp/index')
// const { setOptions } = require('koa-session-getter')
// const initRedis = require("./src/redis/initRedis");
// const redis = require("./src/redis/index");

// control
// .start({
//   size: control.CPUS,
//   shutdownTimeout: 5000,
//   terminateTimeout: 5000,
//   throttleDelay: 5000,
// })
// .on('error', function (err) {
//   console.error('Found error on worker "%s"', err)
//   // don’t need to manually restart the workers
// })

const mongooseURI = process.env.MONGO_DB
console.log("process.env", process.env.MONGO_DB)
const mongooseOpt = {
  authSource: "admin",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "test",
  // user: 'root',
  // pass: 'example'
};

mongoose
  .connect(mongooseURI, mongooseOpt)
  .then((res) => {
    console.log("connect_mongo");
    // initRedis.init()
  })
  .catch((e) => {
    console.log("error", e);
  });
// messaging.init()
if (cluster.isMaster && process.env.CLUSTER === "true") {
  //
  for (var i = 0; i < numCPUs - 2; i++) {
    cluster.fork();
    console.log("...", i);
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const statsOptions = {
    path: "/status",
    spans: [
      {
        interval: 1, // Every second
        retention: 60, // Keep 60 datapoints in memory
      },
      {
        interval: 5, // Every 5 seconds
        retention: 60,
      },
      {
        interval: 15, // Every 15 seconds
        retention: 60,
      },
      {
        interval: 30, // Every 30 seconds
        retention: 60,
      },
    ],
  };
  app.use(cors());
  app.use(bodyParser());
  // app.use((ctx, next) => {
  //   const used = process.memoryUsage();
  //   for (let key in used) {
  //     console.log(
  //       `Memory: ${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
  //     );
  //   }
  //   next();
  // });
  app.use(api.routes());
  app.use((ctx) => {
    ctx.body = { message: '3333333' }
  });
  app.on("error", (err) => {
    console.log("error", err);
  });
  app.listen(8001, () => {
    console.log("server port 8001 start.......");
  });
}
