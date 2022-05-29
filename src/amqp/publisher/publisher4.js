
const {  amqpConnection } = require('../index')

module.exports = () => {
    let conn = amqpConnection()
    conn.createChannel((err, ch) => {
      if (err != null) {
        console.log("error", err);
      }
      console.log('send........')
      ch.assertExchange('topic_logs', 'topic', {
        durable: false
      });
      ch.publish('topic_logs', 'anonymous.info', Buffer.from('topic_logs>>>>>>>>>>>>'));
      ch.on('success', async () => {
        console.log('Success sendToQueue')
      })
      .on('error', () => {
        console.log('Error sendToQueue')
      })
      .on('return', () => {
        console.log('Warning sendToQueue')
      })
    });
  };