const Redis = require('ioredis')
require("dotenv/config");
const client = new Redis({
    port: process.env.REDIS_PORT, // Redis port
    host: process.env.REDIS_URL, // Redis host
    username: process.env.REDIS_USER, // needs Redis >= 6
    password: process.env.REDIS_PASSWORD,
    db: 0, // Defaults to 0
})
module.exports = client