const amqp = require("amqplib/callback_api");
const fs = require("fs");
const normalizedPath = require("path").join(__dirname, "/consumer");
let amqpConnection;

exports.amqpConnection = () => amqpConnection;

exports.init = () => {
    // "amqp://localhost:5672" 
  amqp.connect(process.env.AMQP_URL, async (error, connection) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    amqpConnection = connection;
    fs.readdirSync(normalizedPath).forEach((el) => {
      require(`./consumer/${el}`)(connection);
    });
  });
};
