const {  amqpConnection } = require('../index')

module.exports = () => {
    let conn = amqpConnection()
    conn.createChannel((err, ch) => {
    if (err != null) {
      console.log("error", err);
    }
    ch.assertQueue("test1");
    ch.sendToQueue("test1", Buffer.from("something to do test1"));
  });
};