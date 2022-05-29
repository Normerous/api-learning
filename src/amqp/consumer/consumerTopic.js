module.exports = (connection) => {
    connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var exchange = 'topic_logs';
    
        channel.assertExchange(exchange, 'topic', {
          durable: false
        });
    
        channel.assertQueue('22', {
          exclusive: true
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(' [*] Waiting for logs.');
          let args = ['*.info']
          args.forEach(function(key) {
            channel.bindQueue(q.queue, exchange, key);
          });
    
          channel.consume(q.queue, function(msg) {
            console.log(" [consumerTopic] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          }, {
            noAck: true
          });
        });
      });
  };