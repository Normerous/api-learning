var amqp = require('amqplib/callback_api');
// direct
var args = process.argv.slice(2) || ['info', 'warning', 'error']

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect('amqp://localhost:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'direct_logs';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    channel.assertQueue('myqueue', {
      exclusive: false
      }, function(error2, q) {
        if (error2) {
          throw error2;
        }
      console.log(' [*] Waiting for logs. To exit press CTRL+C', q.queue);

      args.forEach(function(severity) {
        channel.bindQueue(q.queue, exchange, severity);
      });

      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
});