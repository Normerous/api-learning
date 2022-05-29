const {  amqpConnection } = require('../index')

module.exports = () => {
    let conn = amqpConnection()
    conn.createChannel((err, ch) => {
      if (err != null) {
        console.log("error", err);
      }
      ch.assertExchange('logs', 'direct', {
        durable: false
      });
      ch.publish('logs', 'log2', Buffer.from('xxxxxxxxxxxxx'));
    });
  };