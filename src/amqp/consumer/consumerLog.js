module.exports = (connection) => {
  connection.createChannel((err, channel) => {
    if (err) {
      console.log("error:", err);
    }

    channel.assertExchange("logs", "direct", {
      durable: false,
    });

    console.log("con logs");
    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        ["log1", "log2", "log3"].forEach(function (severity) {
          channel.bindQueue(q.queue, "logs", severity);
        });

        channel.consume(
          q.queue,
          function (msg) {
            console.log(
              " [consumerLog] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString()
            );
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
};
