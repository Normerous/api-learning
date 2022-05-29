const Router = require("koa-router");
const messaging = require('../amqp/publisher/publisher1')
const messaging3 = require('../amqp/publisher/publisher3')
const messaging4 = require('../amqp/publisher/publisher4')

const router = new Router({ prefix: "/amqp" });

router.get('/test1', async (ctx) => {
    messaging()
    ctx.message = 'success'
    ctx.status = 200
    ctx.statusCode = 200
})

router.get('/test3', async (ctx) => {
    messaging4()
    ctx.message = 'success'
    ctx.status = 200
})

module.exports = router;