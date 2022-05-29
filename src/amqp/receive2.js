var amqp = require("amqplib/callback_api");
var queue = "task_queue";

amqp.connect("amqp://localhost:5672", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, {
      durable: true,
    });
    channel.prefetch(1); // ทำทีละ 1 queue
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      function (msg) {
        var secs = msg.content.toString().split(" ").length - 1;

        console.log(" [x] Received %s", msg.content.toString(), secs);
        setTimeout(function () {
          console.log(" [x] Done");
          channel.ack(msg); // บอกว่าทำเสร็จแล้ว
        }, secs * 1000);
      },
      {
        // automatic acknowledgment mode,
        // see ../confirms.html for details
        noAck: false,
      }
    );
  });
});
