const Redis = require('ioredis')

const client = new Redis('redis://localhost:6379')

// client.on("connection", (stream) => {
//     console.log("redis://localhost:6379 is connected")
// }).on("error", () => {
//     console.log("error redis: ", error)
// }
module.exports = client