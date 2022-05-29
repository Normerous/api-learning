const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const api = require('./api');
const mongoDB = require('./mongoDB')
const genbooking = require('./genBooking')
const amqp = require('./amqp')
const auth = require('./auth')
const upload = require('./upload')

router.use('', api.routes())
router.use('', mongoDB.routes())
router.use('', genbooking.routes())
router.use('', amqp.routes())
router.use('', auth.routes())
router.use('', upload.routes())
module.exports = router