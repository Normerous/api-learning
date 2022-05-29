 const {  amqpConnection } = require('../index')

module.exports = () => {
    amqpConnection().createChannel((err, ch) => {
      if (err != null) {
        console.log("error", err);
      }
      ch.assertQueue("test2");
      ch.sendToQueue("test2", Buffer.from("something to do test2"));
    });
  };