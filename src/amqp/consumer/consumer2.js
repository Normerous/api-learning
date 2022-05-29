module.exports = (connection) => {
    connection.createChannel((err, channel) => {
        if(err) {
            console.log("error:", err)
        }
        console.log("con2")
        channel.assertQueue('test2')
        channel.consume('test2', (msg) => {
          if (msg !== null) {
              setTimeout(function () {
                console.log(msg.content.toString());
                console.log(" [x] Done");
                channel.ack(msg); // บอกว่าทำเสร็จแล้ว
              }, 3 * 1000);
            }
        }, {
            noAck: false,
        })
    })
}