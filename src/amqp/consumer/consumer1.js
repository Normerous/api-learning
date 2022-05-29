module.exports = (connection) => {
  connection.createChannel((err, channel) => {
    if (err) {
      console.log("error:", err);
    }
    console.log("con1");
    channel.assertQueue("test1");
    channel.consume(
      "test1",
      (msg) => {
        if (msg !== null) {
            console.log(" [.] Get msg ........")
          setTimeout(function () {
            console.log(msg.content.toString());
            console.log(" [x] Done");
            channel.ack(msg); // บอกว่าทำเสร็จแล้ว
          },4 * 1000);
        }
      },
      {
        noAck: false,
      }
    );
  });
};
